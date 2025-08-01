const fs = require('fs');
const path = require('path');

// Ensure the team directory exists
const teamDir = path.join(__dirname, '../public/team');
if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

// Create a simple SVG placeholder
function createPlaceholder(name, index) {
  // Generate a color based on the index
  const colors = [
    '#4f46e5', '#0891b2', '#059669', '#65a30d', 
    '#ca8a04', '#dc2626', '#c026d3', '#7c3aed'
  ];
  const bgColor = colors[index % colors.length];
  const textColor = '#ffffff';
  
  // Get initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bgColor}" />
    <text x="200" y="200" font-family="Arial" font-size="120" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
      ${initials}
    </text>
    <text x="200" y="300" font-family="Arial" font-size="24" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
      Team Member
    </text>
  </svg>`;

  const filePath = path.join(teamDir, `placeholder.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Created placeholder at ${filePath}`);
}

// Create a placeholder image
createPlaceholder('Team Member', 0);

console.log('Placeholder generated successfully!');
