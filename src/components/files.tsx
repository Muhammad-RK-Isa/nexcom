import NextImage from "next/image";

import type { Image } from "~/types";

import { EmptyCard } from "~/components/empty-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

interface FilesProps {
  files: Image[];
}

export function Files({ files }: FilesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <ScrollArea className="max-w-xs pb-4 sm:max-w-md lg:max-w-lg">
            <div className="flex w-max space-x-2.5">
              {files.map((file) => (
                <div key={file.id} className="relative size-44">
                  <NextImage
                    src={file.url}
                    alt={file.name}
                    fill
                    sizes="(min-width: 640px) 640px, 100vw"
                    loading="lazy"
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <EmptyCard
            title="No files uploaded"
            description="Upload some files to see them here"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  );
}