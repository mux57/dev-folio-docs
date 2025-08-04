import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCache } from './useCache';
import { useToast } from '@/hooks/use-toast';

export interface ResumeLink {
  id: string;
  google_drive_link: string;
  direct_download_link: string;
  file_name: string;
  file_size_mb: string;
  last_updated: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Hook to get active resume links
export const useResumeLinks = () => {
  const { getCacheConfig } = useCache();
  const cacheConfig = getCacheConfig('resumeLinks');

  return useQuery({
    queryKey: [cacheConfig.key],
    queryFn: async (): Promise<ResumeLink[]> => {
      const { data, error } = await supabase
        .from('resume_links')
        .select('*');

      if (error) {
        console.error('❌ Error fetching resume links:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: cacheConfig.staleTime,
    gcTime: cacheConfig.cacheTime,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Hook to get the primary resume link (first active one)
export const usePrimaryResumeLink = () => {
  const { data: resumeLinks, ...rest } = useResumeLinks();
  
  return {
    ...rest,
    data: resumeLinks?.[0] || null,
  };
};

// Hook to update resume link
export const useUpdateResumeLink = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ResumeLink> }) => {
      const { data, error } = await supabase
        .from('resume_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-links'] });
      toast({
        title: "Resume link updated",
        description: "The resume link has been successfully updated.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating resume link:', error);
      toast({
        title: "Error updating resume link",
        description: error.message || "Failed to update resume link. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Utility function to download resume
export const downloadResume = async (resumeLink?: ResumeLink | null) => {
  if (!resumeLink) {
    console.error('No resume link provided');
    return;
  }

  // Use direct_download_link for better download experience, fallback to google_drive_link
  const downloadUrl = resumeLink.direct_download_link || resumeLink.google_drive_link;

  if (!downloadUrl || typeof downloadUrl !== 'string') {
    console.error('Invalid or missing download URL in resume link:', resumeLink);
    throw new Error('Resume download URL is missing or invalid');
  }

  try {
    // For Google Drive links, open directly
    if (downloadUrl.includes('drive.google.com')) {
      window.open(downloadUrl, '_blank');
      return;
    }

    // For other URLs, try to download with custom filename
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    // Use file_name from API response
    const fileName = resumeLink.file_name || 'resume.pdf';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading resume:', error);
    // Fallback: open in new tab (only if URL is valid)
    if (downloadUrl && typeof downloadUrl === 'string') {
      window.open(downloadUrl, '_blank');
    } else {
      throw new Error('Cannot download resume: invalid download URL');
    }
  }
};

// Hook for downloading resume with loading state
export const useDownloadResume = () => {
  const { data: primaryResume } = usePrimaryResumeLink();
  const { toast } = useToast();

  const downloadResumeWithToast = async (customResumeLink?: ResumeLink) => {
    const resumeToDownload = customResumeLink || primaryResume;

    if (!resumeToDownload) {
      console.log('No resume found. Primary resume:', primaryResume);
      toast({
        title: "No resume available",
        description: "Resume link not found. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Debug log the resume data
    console.log('Attempting to download resume:', resumeToDownload);

    try {
      await downloadResume(resumeToDownload);
      toast({
        title: "Resume download started",
        description: `Downloading ${resumeToDownload.name}...`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    downloadResume: downloadResumeWithToast,
    primaryResume,
    isLoading: !primaryResume,
  };
};
