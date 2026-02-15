# Supabase Storage Setup Guide

## Required Storage Buckets

You need to create the following storage buckets in your Supabase project:

### 1. Create Buckets

Go to **Storage** in your Supabase dashboard and create these buckets:

#### Bucket: `profiles`
- **Name**: profiles
- **Public**: ✅ Yes (for profile images)
- **File size limit**: 10 MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp

#### Bucket: `analytics`
- **Name**: analytics
- **Public**: ✅ Yes (for analytics screenshots)
- **File size limit**: 10 MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp

#### Bucket: `thumbnails`
- **Name**: thumbnails
- **Public**: ✅ Yes (for reel thumbnails)
- **File size limit**: 10 MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp

### 2. Set Storage Policies

For each bucket, set up the following RLS policies:

#### Policy: Allow authenticated uploads
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('profiles', 'analytics', 'thumbnails')
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy: Allow public read
```sql
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('profiles', 'analytics', 'thumbnails'));
```

#### Policy: Allow users to delete their own files
```sql
CREATE POLICY "Allow users to delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN ('profiles', 'analytics', 'thumbnails')
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Using the Upload API

#### Upload a file:
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: your-session-cookie" \
  -F "file=@/path/to/image.jpg" \
  -F "type=profile"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "user-id_1234567890.jpg",
    "filePath": "user-id/user-id_1234567890.jpg",
    "url": "https://your-project.supabase.co/storage/v1/object/public/profiles/...",
    "bucket": "profiles",
    "size": 2048576,
    "type": "image/jpeg"
  }
}
```

#### Delete a file:
```bash
curl -X DELETE "http://localhost:3000/api/upload?path=user-id/filename.jpg&bucket=profiles" \
  -H "Cookie: your-session-cookie"
```

### 4. File Type Parameters

- **`profile`** - For user profile pictures
- **`analytics`** - For Instagram/YouTube analytics screenshots
- **`thumbnail`** - For reel/video thumbnails

### 5. Validation Rules

- **Max file size**: 10MB
- **Allowed formats**: JPEG, PNG, WebP
- **Authentication**: Required
- **Ownership**: Files are stored in user-specific folders

### 6. Integration Example

After uploading, update the profile with the URL:

```typescript
// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('type', 'profile');

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { data } = await uploadResponse.json();

// Update profile with URL
await fetch(`/api/creators/${creatorId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    profile_image_url: data.url
  })
});
```

## Troubleshooting

### Error: "Bucket not found"
- Verify buckets are created in Supabase Storage
- Check bucket names match exactly: `profiles`, `analytics`, `thumbnails`

### Error: "Policy violation"
- Ensure RLS policies are set up correctly
- Verify user is authenticated

### Error: "File too large"
- Maximum file size is 10MB
- Compress images before uploading
