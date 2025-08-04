import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ResumeLink {
  id: string;
  name: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Hook to get active resume links
export const useResumeLinks = () => {
  return useQuery({
    queryKey: ['resume-links'],
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
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

  try {
    // For Google Drive links, we can use them directly
    if (resumeLink.file_url.includes('drive.google.com')) {
      // Open Google Drive download link in new tab
      window.open(resumeLink.file_url, '_blank');
      return;
    }

    // For other URLs, try to download with custom filename
    const response = await fetch(resumeLink.file_url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeLink.name.replace(/[^a-zA-Z0-9]/g, '_')}.${resumeLink.file_type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading resume:', error);
    // Fallback: open in new tab
    window.open(resumeLink.file_url, '_blank');
  }
};

// Hook for downloading resume with loading state
export const useDownloadResume = () => {
  const { data: primaryResume } = usePrimaryResumeLink();
  const { toast } = useToast();

  const downloadResumeWithToast = async (customResumeLink?: ResumeLink) => {
    const resumeToDownload = customResumeLink || primaryResume;
    
    if (!resumeToDownload) {
      toast({
        title: "No resume available",
        description: "Resume link not found. Please try again later.",
        variant: "destructive",
      });
      return;
    }

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
