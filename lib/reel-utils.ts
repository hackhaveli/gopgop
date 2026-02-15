// Utility functions for handling Instagram and YouTube reel links

/**
 * Extracts the Instagram embed ID from various Instagram URL formats
 */
export function getInstagramEmbedId(url: string): string | null {
    // Match patterns like:
    // - https://www.instagram.com/reel/ABC123/
    // - https://www.instagram.com/p/ABC123/
    // - https://instagram.com/reel/ABC123
    const patterns = [
        /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function getYouTubeEmbedId(url: string): string | null {
    // Match patterns like:
    // - https://www.youtube.com/watch?v=ABC123
    // - https://youtu.be/ABC123
    // - https://m.youtube.com/watch?v=ABC123
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
        /youtube\.com\/watch\?.*v=([A-Za-z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

/**
 * Determines the platform from a URL
 */
export function detectPlatform(url: string): 'instagram' | 'youtube' | 'other' {
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    return 'other';
}

/**
 * Gets the embed URL for YouTube (ready to use in iframe)
 */
export function getYouTubeEmbedUrl(url: string): string | null {
    const videoId = getYouTubeEmbedId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Gets the Instagram embed URL (for iframe - requires oEmbed API for full embed)
 * Note: Instagram embeds require Facebook/Instagram API access
 * This returns a simple embed URL, but won't show full content without API
 */
export function getInstagramEmbedUrl(url: string): string | null {
    const postId = getInstagramEmbedId(url);
    if (!postId) return null;
    // Instagram embed format
    return `https://www.instagram.com/p/${postId}/embed/`;
}

/**
 * Validates if a URL is a valid social media link
 */
export function isValidSocialMediaUrl(url: string): boolean {
    const trimmed = url.trim();
    return (
        trimmed.length > 0 &&
        (trimmed.startsWith('http://') ||
            trimmed.startsWith('https://') ||
            trimmed.startsWith('www.') ||
            trimmed.includes('instagram.com') ||
            trimmed.includes('youtube.com') ||
            trimmed.includes('youtu.be'))
    );
}

/**
 * Normalizes a URL by adding https:// if missing
 */
export function normalizeUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return `https://${trimmed}`;
    }
    return trimmed;
}
