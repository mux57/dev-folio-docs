// Mock resume download functionality
// In a real application, this would connect to your backend API

export const downloadResume = () => {
  // Create a mock PDF content
  const resumeContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 <<
      /Type /Font
      /Subtype /Type1
      /BaseFont /Times-Roman
    >>
  >>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(Software Engineer Resume) Tj
0 -20 Td
(Full Stack Developer) Tj
0 -40 Td
(Skills: React, Node.js, TypeScript, Python) Tj
0 -20 Td
(Experience: 5+ years in web development) Tj
0 -20 Td
(Contact: contact@example.com) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000350 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
600
%%EOF`;

  const blob = new Blob([resumeContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Software_Engineer_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

// Alternative: Connect to your actual resume file
export const downloadActualResume = () => {
  const link = document.createElement('a');
  link.href = '/resume.pdf'; // This would be your actual resume file in the public folder
  link.download = 'Software_Engineer_Resume.pdf';
  link.click();
};