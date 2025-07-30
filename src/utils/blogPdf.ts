import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface BlogPost {
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: string;
}

export const generateBlogPDF = async (post: BlogPost) => {
  try {
    // Create a temporary container for the blog content
    const tempContainer = document.createElement('div');
    tempContainer.style.width = '800px';
    tempContainer.style.padding = '40px';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.color = 'black';
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-10000px';
    tempContainer.style.left = '-10000px';

    // Build the HTML content
    tempContainer.innerHTML = `
      <div style="margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 15px; color: #1a202c;">${post.title}</h1>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; color: #666; font-size: 14px; margin-bottom: 15px;">
          <span>📅 ${new Date(post.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <span>⏱️ ${post.readTime}</span>
          <span>👤 ${post.author}</span>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${post.tags.map(tag => 
            `<span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #555;">${tag}</span>`
          ).join('')}
        </div>
      </div>
      <div style="line-height: 1.6; font-size: 14px;">
        ${post.content}
      </div>
    `;

    document.body.appendChild(tempContainer);

    // Convert to canvas
    const canvas = await html2canvas(tempContainer, {
      width: 800,
      height: tempContainer.scrollHeight,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Remove the temporary container
    document.body.removeChild(tempContainer);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add the image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content exceeds one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const fileName = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};