import jsPDF from 'jspdf';

export interface BlogPost {
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: string;
}

// Helper function to strip HTML tags and clean text for PDF
const stripHtml = (html: string): string => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  let text = temp.textContent || temp.innerText || '';

  // Clean up common problematic characters for PDF
  text = text
    .replace(/[""]/g, '"')     // Smart quotes to regular quotes
    .replace(/['']/g, "'")     // Smart apostrophes to regular apostrophes
    .replace(/[—–]/g, '-')     // Em/en dashes to regular dash
    .replace(/…/g, '...')      // Ellipsis to three dots
    .replace(/[\u2000-\u206F]/g, ' ') // Replace various Unicode spaces with regular space
    .replace(/[\u2070-\u209F]/g, '')  // Remove superscript/subscript
    .replace(/[\u20A0-\u20CF]/g, '')  // Remove currency symbols
    .replace(/[\u2100-\u214F]/g, '')  // Remove letterlike symbols
    .replace(/[\u2190-\u21FF]/g, '')  // Remove arrows
    .replace(/[\u2600-\u26FF]/g, '')  // Remove miscellaneous symbols (including emojis)
    .replace(/[\u2700-\u27BF]/g, '')  // Remove dingbats
    .replace(/[\uFE00-\uFE0F]/g, '')  // Remove variation selectors
    .replace(/[\u1F600-\u1F64F]/g, '') // Remove emoticons
    .replace(/[\u1F300-\u1F5FF]/g, '') // Remove misc symbols
    .replace(/[\u1F680-\u1F6FF]/g, '') // Remove transport symbols
    .replace(/[\u1F1E0-\u1F1FF]/g, '') // Remove flags
    .trim();

  return text;
};

// Optimized text-based PDF generation for much smaller file sizes
export const generateBlogPDF = async (post: BlogPost) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = pageWidth - (margin * 2);

    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number, isBold = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) pdf.setFont('helvetica', 'bold');
      else pdf.setFont('helvetica', 'normal');

      const lines = pdf.splitTextToSize(text, maxWidth);

      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      }
      yPosition += 3; // Extra spacing
    };

    // Add title
    addText(post.title, 18, true);
    yPosition += 5;

    // Add metadata (without emojis to avoid encoding issues)
    const dateStr = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    addText(`Date: ${dateStr} | Reading Time: ${post.readTime} | Author: ${post.author}`, 10);

    // Add tags
    if (post.tags.length > 0) {
      addText(`Tags: ${post.tags.join(', ')}`, 10);
    }

    // Add separator line
    yPosition += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Add content (strip HTML and format)
    const cleanContent = stripHtml(post.content);
    addText(cleanContent, 11);

    // Save the PDF
    const fileName = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};