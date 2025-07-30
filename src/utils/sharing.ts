// Social sharing utilities

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

// Native Web Share API
export const shareNative = async (data: ShareData) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }
  return false;
};

// Copy to clipboard
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

// WhatsApp sharing
export const shareToWhatsApp = (data: ShareData) => {
  const text = `${data.title}\n\n${data.text}\n\n${data.url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
};

// Email sharing
export const shareToEmail = (data: ShareData) => {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(`${data.text}\n\nRead more: ${data.url}`);
  const emailUrl = `mailto:?subject=${subject}&body=${body}`;
  window.open(emailUrl);
};

// LinkedIn sharing
export const shareToLinkedIn = (data: ShareData) => {
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;
  window.open(linkedinUrl, '_blank');
};

// Twitter sharing
export const shareToTwitter = (data: ShareData) => {
  const text = `${data.title}\n\n${data.text}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.url)}`;
  window.open(twitterUrl, '_blank');
};

// Facebook sharing
export const shareToFacebook = (data: ShareData) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
  window.open(facebookUrl, '_blank');
};

// Telegram sharing
export const shareToTelegram = (data: ShareData) => {
  const text = `${data.title}\n\n${data.text}\n\n${data.url}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(text)}`;
  window.open(telegramUrl, '_blank');
};