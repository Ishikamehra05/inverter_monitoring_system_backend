import { promises as fs } from "node:fs";
import path from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

type UploadRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(
  _request: Request,
  context: UploadRouteContext,
): Promise<Response> {
  const { path: pathSegments } = await context.params;
  const uploadsDirectory = path.resolve(process.cwd(), "uploads");
  const filePath = path.resolve(uploadsDirectory, ...pathSegments);
  const uploadsPrefix = `${uploadsDirectory}${path.sep}`;

  if (!filePath.startsWith(uploadsPrefix)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType =
      CONTENT_TYPES[path.extname(filePath).toLowerCase()] ??
      "application/octet-stream";

    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
