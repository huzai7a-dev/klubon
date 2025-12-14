import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";

class StorageService {
    /**
     * Uploads an image to Supabase Storage.
     * @param uri Local file URI of the image.
     * @param bucket Storage bucket name.
     * @param path Desired storage path (e.g., 'avatars/user_id.jpg').
     * @returns The public URL of the uploaded image or null on failure.
     */
    async uploadImage(uri: string, bucket: string, path: string): Promise<string | null> {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: "base64",
            });

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, decode(base64), {
                    contentType: "image/jpeg", // Assuming JPEG for simplicity, could infer from URI
                    upsert: true,
                });

            if (error) {
                console.error("Storage upload error:", error);
                return null;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(path);

            return publicUrl;
        } catch (error) {
            console.error("Image upload failed:", error);
            return null;
        }
    }
}

export default new StorageService();
