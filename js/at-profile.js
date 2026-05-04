/**
 * Appalachian Trail Elevation Profile Module
 * Animated SVG elevation profile that fills on scroll
 */

(function() {
  'use strict';

  // AT Elevation data points (simplified, mile markers with elevation in feet)
  // Based on actual AT profile: Georgia to Maine
  const AT_DATA = [
    { mile: 0, elevation: 3782, state: 'GA', name: 'Springer Mountain' },
    { mile: 30, elevation: 4461, state: 'GA', name: 'Blood Mountain' },
    { mile: 78, elevation: 4430, state: 'NC', name: 'Standing Indian' },
    { mile: 137, elevation: 5498, state: 'NC', name: 'Clingmans Dome' },
    { mile: 200, elevation: 4629, state: 'TN', name: 'Max Patch' },
    { mile: 275, elevation: 5516, state: 'NC', name: 'Roan High Knob' },
    { mile: 330, elevation: 4100, state: 'VA', name: 'Damascus' },
    { mile: 465, elevation: 5729, state: 'VA', name: 'Mt Rogers area' },
    { mile: 550, elevation: 4049, state: 'VA', name: 'McAfee Knob' },
    { mile: 700, elevation: 3500, state: 'VA', name: 'Shenandoah' },
    { mile: 850, elevation: 2000, state: 'WV', name: 'Harpers Ferry' },
    { mile: 970, elevation: 2461, state: 'PA', name: 'Pine Grove' },
    { mile: 1100, elevation: 1600, state: 'PA', name: 'Delaware Water Gap' },
    { mile: 1200, elevation: 1653, state: 'NJ', name: 'High Point' },
    { mile: 1280, elevation: 1300, state: 'NY', name: 'Bear Mountain' },
    { mile: 1400, elevation: 2316, state: 'CT', name: 'Bear Mountain CT' },
    { mile: 1500, elevation: 3491, state: 'MA', name: 'Mt Greylock' },
    { mile: 1600, elevation: 3748, state: 'VT', name: 'Killington' },
    { mile: 1750, elevation: 4802, state: 'NH', name: 'Moosilauke' },
    { mile: 1850, elevation: 6288, state: 'NH', name: 'Mt Washington' },
    { mile: 1950, elevation: 4041, state: 'NH', name: 'Wildcats' },
    { mile: 2050, elevation: 4000, state: 'ME', name: 'Mahoosuc' },
    { mile: 2150, elevation: 5267, state: 'ME', name: 'Katahdin' }
  ];

  // State boundaries (approximate mile markers)
  const STATE_LINES = [
    { mile: 78, state: 'GA/NC' },
    { mile: 165, state: 'NC/TN' },
    { mile: 330, state: 'TN/VA' },
    { mile: 850, state: 'VA/WV' },
    { mile: 890, state: 'WV/MD' },
    { mile: 920, state: 'MD/PA' },
    { mile: 1100, state: 'PA/NJ' },
    { mile: 1165, state: 'NJ/NY' },
    { mile: 1350, state: 'NY/CT' },
    { mile: 1400, state: 'CT/MA' },
    { mile: 1500, state: 'MA/VT' },
    { mile: 1600, state: 'VT/NH' },
    { mile: 1900, state: 'NH/ME' }
  ];

  let profileElement = null;
  let fillPath = null;
  let progressIndicator = null;
  let tooltip = null;
  let animationProgress = 0;

  // ==========================================================================
  // SVG Generation
  // ==========================================================================

  /**
   * Generate SVG path data from elevation points
   */
  function generatePathData(data, width, height, padding) {
    const minMile = 0;
    const maxMile = 2190; // Total AT miles
    const minElev = 0;
    const maxElev = 6500;

    const scaleX = (mile) => padding + (mile / maxMile) * (width - 2 * padding);
    const scaleY = (elev) => height - padding - (elev / maxElev) * (height - 2 * padding);

    // Create smooth curve using cardinal spline
    let pathData = `M ${scaleX(data[0].mile)} ${scaleY(data[0].elevation)}`;

    for (let i = 1; i < data.length; i++) {
      const x = scaleX(data[i].mile);
      const y = scaleY(data[i].elevation);
      pathData += ` L ${x} ${y}`;
    }

    return pathData;
  }

  /**
   * Generate filled area path (for animation)
   */
  function generateFillPath(data, width, height, padding, progress = 1) {
    const minMile = 0;
    const maxMile = 2190;
    const minElev = 0;
    const maxElev = 6500;

    const scaleX = (mile) => padding + (mile / maxMile) * (width - 2 * padding);
    const scaleY = (elev) => height - padding - (elev / maxElev) * (height - 2 * padding);
    const baseY = height - padding;

    // Calculate how many points to show based on progress
    const pointCount = Math.floor(data.length * progress);
    if (pointCount < 1) return '';

    const visibleData = data.slice(0, pointCount);
    const lastPoint = visibleData[visibleData.length - 1];

    let pathData = `M ${scaleX(0)} ${baseY}`;
    pathData += ` L ${scaleX(visibleData[0].mile)} ${scaleY(visibleData[0].elevation)}`;

    for (let i = 1; i < visibleData.length; i++) {
      pathData += ` L ${scaleX(visibleData[i].mile)} ${scaleY(visibleData[i].elevation)}`;
    }

    pathData += ` L ${scaleX(lastPoint.mile)} ${baseY}`;
    pathData += ' Z';

    return pathData;
  }

  /**
   * Create the SVG profile element
   */
  function createProfileSVG(container) {
    const width = container.offsetWidth || 800;
    const height = 200;
    const padding = 30;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.classList.add('at-profile__svg');

    // Create defs for gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'at-gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '100%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '0%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'var(--accent-green)');
    stop1.setAttribute('stop-opacity', '0.1');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'var(--accent-green)');
    stop2.setAttribute('stop-opacity', '0.4');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Create fill path (animated)
    fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fillPath.classList.add('at-profile__fill');
    fillPath.setAttribute('fill', 'url(#at-gradient)');
    fillPath.setAttribute('d', '');
    svg.appendChild(fillPath);

    // Create line path
    const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    linePath.classList.add('at-profile__path');
    linePath.setAttribute('d', generatePathData(AT_DATA, width, height, padding));
    linePath.setAttribute('fill', 'none');
    linePath.setAttribute('stroke', 'var(--accent-green)');
    linePath.setAttribute('stroke-width', '2');
    svg.appendChild(linePath);

    // Add state labels
    const stateGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    stateGroup.classList.add('at-profile__states');

    const states = ['GA', 'NC', 'TN', 'VA', 'WV', 'PA', 'NJ', 'NY', 'CT', 'MA', 'VT', 'NH', 'ME'];
    const stateMiles = [40, 120, 250, 590, 870, 1010, 1130, 1270, 1375, 1450, 1550, 1750, 2050];

    const scaleX = (mile) => padding + (mile / 2190) * (width - 2 * padding);

    states.forEach((state, i) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', scaleX(stateMiles[i]));
      text.setAttribute('y', height - 8);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'var(--text-muted)');
      text.setAttribute('font-size', '10');
      text.textContent = state;
      stateGroup.appendChild(text);
    });

    svg.appendChild(stateGroup);

    // Add mile markers
    const mileGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mileGroup.classList.add('at-profile__miles');

    [0, 500, 1000, 1500, 2000].forEach(mile => {
      const x = scaleX(mile);

      // Vertical line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x);
      line.setAttribute('y1', padding);
      line.setAttribute('x2', x);
      line.setAttribute('y2', height - padding);
      line.setAttribute('stroke', 'var(--border-color)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '2,4');
      mileGroup.appendChild(line);

      // Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', padding - 8);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'var(--text-muted)');
      text.setAttribute('font-size', '9');
      text.textContent = `${mile} mi`;
      mileGroup.appendChild(text);
    });

    svg.appendChild(mileGroup);

    // Add interactive overlay for hover
    const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    overlay.setAttribute('x', padding);
    overlay.setAttribute('y', padding);
    overlay.setAttribute('width', width - 2 * padding);
    overlay.setAttribute('height', height - 2 * padding);
    overlay.setAttribute('fill', 'transparent');
    overlay.classList.add('at-profile__overlay');
    svg.appendChild(overlay);

    // Progress indicator (vertical line showing current position)
    progressIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    progressIndicator.classList.add('at-profile__progress');
    progressIndicator.setAttribute('x1', padding);
    progressIndicator.setAttribute('y1', padding);
    progressIndicator.setAttribute('x2', padding);
    progressIndicator.setAttribute('y2', height - padding);
    progressIndicator.setAttribute('stroke', 'var(--accent-blue)');
    progressIndicator.setAttribute('stroke-width', '2');
    progressIndicator.setAttribute('opacity', '0');
    svg.appendChild(progressIndicator);

    container.appendChild(svg);

    return { svg, width, height, padding };
  }

  // ==========================================================================
  // Scroll Animation
  // ==========================================================================

  /**
   * Update animation based on scroll progress
   */
  function updateAnimation(progress) {
    if (!fillPath || !profileElement) return;

    const container = profileElement;
    const width = container.offsetWidth || 800;
    const height = 200;
    const padding = 30;

    // Update fill path
    const fillD = generateFillPath(AT_DATA, width, height, padding, progress);
    fillPath.setAttribute('d', fillD);

    // Update progress indicator
    if (progressIndicator) {
      const scaleX = (mile) => padding + (mile / 2190) * (width - 2 * padding);
      const currentMile = 2190 * progress;
      const x = scaleX(currentMile);

      progressIndicator.setAttribute('x1', x);
      progressIndicator.setAttribute('x2', x);
      progressIndicator.setAttribute('opacity', progress > 0 && progress < 1 ? '1' : '0');
    }

    animationProgress = progress;
  }

  /**
   * Initialize scroll-based animation
   */
  function initScrollAnimation() {
    if (!profileElement) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateAnimation(1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Start animation when element comes into view
            animateOnScroll();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(profileElement);
  }

  /**
   * Animate fill on scroll
   */
  function animateOnScroll() {
    const profileRect = profileElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    function update() {
      const rect = profileElement.getBoundingClientRect();

      // Calculate progress based on element position
      // Start filling when element enters viewport, complete when it's mostly past
      const startPoint = viewportHeight;
      const endPoint = -rect.height / 2;
      const currentPoint = rect.top;

      let progress = 1 - ((currentPoint - endPoint) / (startPoint - endPoint));
      progress = Math.max(0, Math.min(1, progress));

      updateAnimation(progress);

      // Continue animation if element is still in view
      if (rect.bottom > 0 && rect.top < viewportHeight) {
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ==========================================================================
  // Hover Tooltip
  // ==========================================================================

  /**
   * Initialize hover tooltip
   */
  function initTooltip() {
    if (!profileElement) return;

    const svg = profileElement.querySelector('.at-profile__svg');
    const overlay = profileElement.querySelector('.at-profile__overlay');

    if (!svg || !overlay) return;

    // Create tooltip element
    tooltip = document.createElement('div');
    tooltip.classList.add('at-profile__tooltip');
    tooltip.style.cssText = `
      position: absolute;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 8px 12px;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
      z-index: 10;
    `;
    profileElement.style.position = 'relative';
    profileElement.appendChild(tooltip);

    overlay.addEventListener('mousemove', (e) => {
      const rect = svg.getBoundingClientRect();
      const padding = 30;
      const width = rect.width;
      const x = e.clientX - rect.left;

      // Calculate mile from x position
      const mile = Math.round(((x - padding) / (width - 2 * padding)) * 2190);

      if (mile < 0 || mile > 2190) {
        tooltip.style.opacity = '0';
        return;
      }

      // Find closest data point
      let closest = AT_DATA[0];
      let minDist = Math.abs(mile - AT_DATA[0].mile);

      AT_DATA.forEach(point => {
        const dist = Math.abs(mile - point.mile);
        if (dist < minDist) {
          minDist = dist;
          closest = point;
        }
      });

      // Interpolate elevation
      let elevation = closest.elevation;
      for (let i = 0; i < AT_DATA.length - 1; i++) {
        if (mile >= AT_DATA[i].mile && mile <= AT_DATA[i + 1].mile) {
          const ratio = (mile - AT_DATA[i].mile) / (AT_DATA[i + 1].mile - AT_DATA[i].mile);
          elevation = Math.round(AT_DATA[i].elevation + ratio * (AT_DATA[i + 1].elevation - AT_DATA[i].elevation));
          break;
        }
      }

      // Update tooltip
      tooltip.innerHTML = `
        <strong>Mile ${mile}</strong><br>
        Elevation: ${elevation.toLocaleString()} ft<br>
        <span style="color: var(--text-muted)">${closest.name}</span>
      `;
      tooltip.style.opacity = '1';
      tooltip.style.left = `${x}px`;
      tooltip.style.top = '-60px';
    });

    overlay.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================

  function init() {
    profileElement = document.getElementById('at-elevation-profile');

    if (!profileElement) return;

    const { svg, width, height, padding } = createProfileSVG(profileElement);
    initScrollAnimation();
    initTooltip();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (profileElement) {
        profileElement.innerHTML = '';
        createProfileSVG(profileElement);
        updateAnimation(animationProgress);
        initTooltip();
      }
    }, 250);
  });
})();
