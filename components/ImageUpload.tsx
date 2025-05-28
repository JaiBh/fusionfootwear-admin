"use client";

import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ImagePlus, TrashIcon } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [mounted, setMounted] = useState(false);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="space-y-6">
      <CldUploadWidget uploadPreset="fusionfootwear-admin" onSuccess={onUpload}>
        {({ open }) => {
          return (
            <Button
              onClick={() => open()}
              disabled={disabled}
              type="button"
              variant={"secondary"}
            >
              <ImagePlus className="size-4 mr-2"></ImagePlus>
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
      {value.map((item) => (
        <div className="relative w-[90vw] aspect-square max-w-60" key={item}>
          <Image
            src={item}
            alt={"Billboard image"}
            fill
            className="object-cover"
          ></Image>
          <Button
            type="button"
            className="absolute top-0 left-0"
            variant={"destructive"}
            onClick={() => onRemove(item)}
            size={"icon"}
          >
            <TrashIcon className="size-4"></TrashIcon>
          </Button>
        </div>
      ))}
    </div>
  );
}
export default ImageUpload;
