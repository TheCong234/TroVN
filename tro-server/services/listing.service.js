import ImageService from "./image.service.js";
import ListingModel from "../models/listing.model.js";
import SearchHistoryService from "./search-history.service.js";
import UserService from "./user.service.js";
import { buildTfIdfMatrix } from "../core/buildTfIdfMatrix.js";
import { convertToNonAccentVietnamese } from "../utils/string.utils.js";
import { logger } from "../config/winston.js";
import redisClient from "../config/redis.client.config.js";
import rentedRoomService from "./rented-room.service.js";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const CACHE_EXPIRATION = process.env.REDIS_CACHE_EXPIRATION;
const USE_REDIS_CACHE = process.env.USE_REDIS_CACHE === "true";

const ListingService = {
  async createListing(listingData) {
    try {
      const existingUser = UserService.getUserById(listingData.userId);
      if (!existingUser) {
        throw Error("Không tim thấy người dùng có id = ", listingData.userId);
      }
      const listing = await ListingModel.methods.createListing(listingData);
      if (!listing) {
        throw new Error("Có lỗi khi thêm listing");
      }
      if (!listingData.imageUrls) {
        throw new Error("Mỗi phòng phải có ít nhất 5 hình ảnh");
      }
      const images = await ImageService.createManyImage(
        listingData.imageUrls.map((item) => ({
          listingId: listing.id,
          caption: listing.title,
          url: item,
        }))
      );

      return {
        ...listing,
        images,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getListingById(listingId) {
    try {
      if (USE_REDIS_CACHE) {
        const cachedListing = await redisClient.get(`listing:${listingId}`);
        if (cachedListing) {
          return JSON.parse(cachedListing);
        }
      }
      const listing = await ListingModel.methods.getListingById(listingId);

      if (!listing) {
        throw new Error("Listing not found");
      }

      if (USE_REDIS_CACHE) {
        await redisClient.setEx(
          `listing:${listingId}`,
          CACHE_EXPIRATION,
          JSON.stringify(listing)
        );
      }

      return listing;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async updateListing(listingId, listingData) {
    try {
      const existingUser = await UserService.getUserById(listingData.userId);

      if (!existingUser) {
        throw Error("Không tim thấy người dùng có id = ", listingData.userId);
      }

      const listing = await ListingModel.methods.getListingByIdAndUserId(
        listingId,
        existingUser.id
      );

      if (existingUser.role !== "ADMIN" && !listing) {
        throw Error("Bạn không phải là chủ phòng hoặc");
      }

      const isRented = await rentedRoomService.hasRentedRoom(listingId);

      if (isRented) {
        throw Error("Phòng đang được thuê");
      }

      const listingUpdate = await ListingModel.methods.updateListing(
        listingId,
        listingData
      );
      if (USE_REDIS_CACHE) {
        const cacheKeyParts = [
          `listings`,
          1,
          20,
          "",
          "",
          "",
          "",
          0,
          "",
          "",
          "",
        ];
        const cacheKey = cacheKeyParts.join(":");
        // Update cache
        await redisClient.del(`listing:${listingId}`);
        await redisClient.del(cacheKey);
        await redisClient.setEx(
          `listing:${listingId}`,
          CACHE_EXPIRATION,
          JSON.stringify(listingUpdate)
        );
      }

      return listingUpdate;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getListingByUserId(userId, page, limit) {
    try {
      const listings = await ListingModel.methods.getListingByUserId(
        userId,
        page,
        limit
      );
      if (!listings) {
        throw new Error("Listing not found");
      }
      return listings;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async deleteListing(listingId) {
    try {
      const result = await ListingModel.methods.deleteListing(listingId);

      redisClient.del(`listing:${listingId}`);

      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getListings(
    page,
    limit,
    keyword,
    latCoords,
    lngCoords,
    amenityIds,
    minPrice,
    maxPrice,
    locationId,
    tagId
  ) {
    const cacheKeyParts = [
      `listings`,
      page || 1,
      limit || 20,
      keyword || "",
      latCoords || "",
      lngCoords || "",
      Array.isArray(amenityIds) ? amenityIds.join(",") : amenityIds || "",
      minPrice || 0,
      maxPrice || "",
      locationId || "",
      tagId || "",
    ];
    const cacheKey = cacheKeyParts.join(":");

    if (USE_REDIS_CACHE) {
      try {
        const cachedListings = await redisClient.get(cacheKey);
        if (cachedListings) {
          logger.info(`Cache hit for key: ${cacheKey}`);
          return JSON.parse(cachedListings);
        }
      } catch (redisError) {
        logger.warn("Redis cache error:", redisError);
      }
    }

    try {
      const listings = await ListingModel.methods.getListings(
        page,
        limit,
        keyword,
        latCoords,
        lngCoords,
        amenityIds,
        minPrice,
        maxPrice,
        locationId,
        tagId
      );

      if (USE_REDIS_CACHE) {
        try {
          await redisClient.setEx(
            cacheKey,
            CACHE_EXPIRATION,
            JSON.stringify(listings)
          );
          logger.info(`Cache stored for key: ${cacheKey}`);
        } catch (cacheError) {
          logger.warn("Failed to store cache:", cacheError);
        }
      }

      return listings;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getNearbyListings(lat, lng, page, limit) {
    try {
      return await ListingModel.methods.getNearbyListings(
        lat,
        lng,
        page,
        limit
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async listingsToGeoJSON() {
    const listings = await ListingModel.methods.listingsToGeo();
    return ListingService.copyTo(listings);
  },

  async getRecommendations(userId) {
    const cacheKey = `recommendations:${userId}`;

    if (USE_REDIS_CACHE) {
      try {
        const cachedRecommendations = await redisClient.get(cacheKey);
        if (cachedRecommendations) {
          logger.info(`Cache hit for recommendations of user: ${userId}`);
          return JSON.parse(cachedRecommendations);
        }
      } catch (redisError) {
        logger.warn("Redis cache error:", redisError);
      }
    }

    try {
      const searchHistory = await SearchHistoryService.findAllContent(userId);
      if (!searchHistory || searchHistory.length === 0) {
        throw new Error("Lịch sử tìm kiếm trống");
      }

      const processedSearchHistory = searchHistory
        .map((item) => {
          if (typeof item === "object") {
            return [convertToNonAccentVietnamese(item.content)]
              .filter(Boolean)
              .join(" ");
          }
          return item;
        })
        .join(" ");

      const listingContents =
        await ListingModel.methods.getAllContentListings();
      const listingTexts = listingContents.map((listing) => {
        const combinedText = [
          convertToNonAccentVietnamese(listing.title) || "",
          convertToNonAccentVietnamese(listing.description) || "",
          convertToNonAccentVietnamese(listing.address) || "",
        ]
          .filter(Boolean)
          .join(" ");
        return combinedText;
      });

      const allTexts = [...listingTexts, processedSearchHistory];
      const { matrix: tfIdfMatrix, vocabulary } = buildTfIdfMatrix(allTexts);

      const searchHistoryVector = tfIdfMatrix.slice(
        [tfIdfMatrix.shape[0] - 1, 0],
        [1, -1]
      );
      const listingVectors = tfIdfMatrix.slice(
        [0, 0],
        [tfIdfMatrix.shape[0] - 1, -1]
      );

      const similarities = [];
      const listingVectorsArray = listingVectors.arraySync();
      const searchHistoryVectorArray = searchHistoryVector.arraySync()[0];

      const searchTerms = vocabulary.filter(
        (_, i) => Math.abs(searchHistoryVectorArray[i]) > 0.001
      );

      for (let i = 0; i < listingVectorsArray.length; i++) {
        const listingVector = listingVectorsArray[i];

        const matchingTerms = vocabulary.filter(
          (term, idx) =>
            Math.abs(listingVector[idx]) > 0.001 &&
            Math.abs(searchHistoryVectorArray[idx]) > 0.001
        );

        let similarity = 0;
        matchingTerms.forEach((term) => {
          const termIndex = vocabulary.indexOf(term);
          similarity +=
            listingVector[termIndex] * searchHistoryVectorArray[termIndex];
        });

        if (matchingTerms.length > 0) {
          const listingNorm = Math.sqrt(
            listingVector.reduce((sum, v) => sum + v * v, 0)
          );
          const searchNorm = Math.sqrt(
            searchHistoryVectorArray.reduce((sum, v) => sum + v * v, 0)
          );
          similarity = similarity / (listingNorm * searchNorm);
        }

        similarities.push({
          listing: listingContents[i],
          score: similarity,
          matchingTerms: matchingTerms,
          debugInfo: {
            termCount: matchingTerms.length,
            listingTerms: vocabulary.filter(
              (_, idx) => Math.abs(listingVector[idx]) > 0.001
            ),
          },
        });
      }

      const topRecommendations = similarities
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      const results = topRecommendations.map(({ listing, score }) => ({
        listing,
        score,
      }));

      if (USE_REDIS_CACHE) {
        try {
          await redisClient.setEx(
            cacheKey,
            CACHE_EXPIRATION,
            JSON.stringify(results)
          );
          logger.info(`Cache stored for recommendations of user: ${userId}`);
        } catch (cacheError) {
          logger.warn("Failed to store cache:", cacheError);
        }
      }

      return results;
    } catch (error) {
      logger.error("Error in getRecommendations:", error);
      throw error;
    }
  },

  copyTo(listings) {
    return {
      type: "FeatureCollection",
      features: listings.map((listing) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [listing.longitude, listing.latitude],
        },
        properties: {
          id: listing.id,
          title: listing.title,
          address: listing.address,
          price: listing.price,
        },
      })),
    };
  },
};
export default ListingService;
