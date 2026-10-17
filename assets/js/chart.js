/**
 * chart.js - Chart.js Configuration & Rendering
 * Dynamically builds and updates Doughnut, Bar, and Line charts based on active user metrics.
 */

let doughnutChart = null;
let barChart = null;
let lineChart = null;

/**
 * Initialize charts for the analytics page
 */
function initAnalyticsCharts() {
  const user = getCurrentUser();
  if (!user) return;

  const isDarkMode = document.body.classList.contains('dark-theme');
  const textColor = isDarkMode ? '#cbd5e1' : '#475569';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  // 1. Render Doughnut Chart (Skill Category Distribution)
  renderCategoryDoughnut(user.skills || [], textColor);

  // 2. Render Bar Chart (Proficiency Level Distribution)
  renderLevelBar(user.skills || [], textColor, gridColor);

  // 3. Render Line Chart (Activities Progression Timeline)
  renderProgressLine(user.activities || [], textColor, gridColor);
}

/**
 * Doughnut: Skills count grouped by categories
 */
function renderCategoryDoughnut(skills, textColor) {
  const canvas = document.getElementById('category-doughnut-chart');
  if (!canvas) return;

  // Aggregate
  const categories = ['Programming', 'Web Development', 'Data Science', 'AI/ML', 'Database', 'Cloud', 'Soft Skills', 'Others'];
  const counts = categories.map(cat => skills.filter(s => s.category === cat).length);

  // Clear if empty
  const totalSkills = counts.reduce((a, b) => a + b, 0);
  if (totalSkills === 0) {
    showChartPlaceholder('category-placeholder-box', 'No skills logged yet. Add some to populate the distribution.');
    return;
  } else {
    hideChartPlaceholder('category-placeholder-box');
  }

  const ctx = canvas.getContext('2d');
  
  if (doughnutChart) {
    doughnutChart.destroy();
  }

  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        label: 'Skills Count',
        data: counts,
        backgroundColor: [
          '#3b82f6', // Blue
          '#8b5cf6', // Purple
          '#10b981', // Green
          '#ec4899', // Pink
          '#f59e0b', // Yellow
          '#06b6d4', // Cyan
          '#f97316', // Orange
          '#64748b'  // Slate
        ],
        borderWidth: document.body.classList.contains('dark-theme') ? 2 : 1,
        borderColor: document.body.classList.contains('dark-theme') ? '#1e293b' : '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor,
            font: { family: 'Poppins', size: 11 }
          }
        },
        tooltip: {
          titleFont: { family: 'Poppins' },
          bodyFont: { family: 'Poppins' }
        }
      }
    }
  });
}

/**
 * Bar: Skills count grouped by proficiency levels
 */
function renderLevelBar(skills, textColor, gridColor) {
  const canvas = document.getElementById('level-bar-chart');
  if (!canvas) return;

  // Aggregate
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const counts = levels.map(lvl => skills.filter(s => s.level === lvl).length);

  // Check if empty
  const totalSkills = counts.reduce((a, b) => a + b, 0);
  if (totalSkills === 0) {
    showChartPlaceholder('level-placeholder-box', 'No skills logged yet. Add some to populate levels index.');
    return;
  } else {
    hideChartPlaceholder('level-placeholder-box');
  }

  const ctx = canvas.getContext('2d');
  
  if (barChart) {
    barChart.destroy();
  }

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: levels,
      datasets: [{
        label: 'Skills Count',
        data: counts,
        backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(16, 185, 129, 0.7)'],
        borderColor: ['#3b82f6', '#8b5cf6', '#10b981'],
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { family: 'Poppins' },
          bodyFont: { family: 'Poppins' }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Poppins' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Poppins' },
            stepSize: 1,
            beginAtZero: true
          }
        }
      }
    }
  });
}

/**
 * Line: Cumulative activity events parsed over time
 */
function renderProgressLine(activities, textColor, gridColor) {
  const canvas = document.getElementById('timeline-line-chart');
  if (!canvas) return;

  // Group activities by date
  // Standard default date categories (last 7 days or last 5 unique days)
  const dateMap = {};
  
  // Exclude simple login/logout actions if possible to focus on skills & cert edits
  const importantActs = activities.filter(a => 
    a.text.toLowerCase().includes('skill') || 
    a.text.toLowerCase().includes('certificate') ||
    a.text.toLowerCase().includes('internship') ||
    a.text.toLowerCase().includes('created')
  );

  // If no important actions, use all activities
  const listToUse = importantActs.length > 0 ? importantActs : activities;

  if (listToUse.length === 0) {
    showChartPlaceholder('timeline-placeholder-box', 'Log skills or upload certificates to see progress trends.');
    return;
  } else {
    hideChartPlaceholder('timeline-placeholder-box');
  }

  // Gather unique days in ascending order
  listToUse.forEach(act => {
    const d = new Date(act.timestamp);
    if (!isNaN(d)) {
      const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap[dayStr] = (dateMap[dayStr] || 0) + 1;
    }
  });

  const labels = Object.keys(dateMap).reverse().slice(-7); // Last 7 active days
  const data = labels.map(lbl => dateMap[lbl]);

  // If only 1 data point, padding elements for layout spacing
  if (labels.length === 1) {
    labels.unshift('Start');
    data.unshift(0);
  }

  const ctx = canvas.getContext('2d');
  
  if (lineChart) {
    lineChart.destroy();
  }

  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Updates Logged',
        data: data,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderColor: '#8b5cf6',
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 7,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { family: 'Poppins' },
          bodyFont: { family: 'Poppins' }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Poppins' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Poppins' },
            stepSize: 1,
            beginAtZero: true
          }
        }
      }
    }
  });
}

/**
 * Handle Theme color adjustments on chart components dynamically
 */
document.addEventListener('themechanged', (e) => {
  const isDark = e.detail.theme === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  // Update Doughnut Options
  if (doughnutChart) {
    doughnutChart.options.plugins.legend.labels.color = textColor;
    doughnutChart.options.datasets[0].borderColor = isDark ? '#1e293b' : '#ffffff';
    doughnutChart.options.datasets[0].borderWidth = isDark ? 2 : 1;
    doughnutChart.update();
  }

  // Update Bar Options
  if (barChart) {
    barChart.options.scales.x.ticks.color = textColor;
    barChart.options.scales.y.ticks.color = textColor;
    barChart.options.scales.y.grid.color = gridColor;
    barChart.update();
  }

  // Update Line Options
  if (lineChart) {
    lineChart.options.scales.x.ticks.color = textColor;
    lineChart.options.scales.y.ticks.color = textColor;
    lineChart.options.scales.y.grid.color = gridColor;
    lineChart.update();
  }
});

/**
 * UI Placeholder hooks when charts have no data counts
 */
function showChartPlaceholder(boxId, message) {
  const box = document.getElementById(boxId);
  if (!box) return;
  
  box.style.display = 'flex';
  box.innerHTML = `
    <div style="text-align: center; color: var(--text-secondary); padding: 40px 10px;">
      <i class="fa-solid fa-chart-line" style="font-size: 2.2rem; margin-bottom: 12px; opacity: 0.4;"></i>
      <p style="font-size: 0.9rem; font-weight:500;">${message}</p>
    </div>
  `;
  
  // Hide matching canvas
  const canvas = box.parentElement.querySelector('canvas');
  if (canvas) canvas.style.display = 'none';
}

function hideChartPlaceholder(boxId) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.style.display = 'none';
  
  // Show matching canvas
  const canvas = box.parentElement.querySelector('canvas');
  if (canvas) canvas.style.display = 'block';
}
