import { BsEye, BsEyeSlashFill } from "react-icons/bs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

const Index = ({
  label,
  control,
  name,
  errors,
  type,
  icon,
  placeholder,
  disabled,
}) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="!mb-1">{label}</FormLabel>
          <FormControl>
            <>
              {type !== "password" && (
                <Input
                  {...field}
                  prefix={icon}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                />
              )}
              {type === "password" && (
                <Input
                  {...field}
                  prefix={icon}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  iconRender={(visible) =>
                    visible ? <BsEye /> : <BsEyeSlashFill />
                  }
                />
              )}
            </>
          </FormControl>
          <FormMessage className="text-xs text-red-500 ">
            {errors?.message}
          </FormMessage>
        </FormItem>
      )}
    />
  );
};

export default Index;
