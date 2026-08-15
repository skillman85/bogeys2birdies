export function cmsTextStyle(style = {}) {
  const nextStyle = {};
  if (style.fontFamily) nextStyle.fontFamily = style.fontFamily;
  if (style.fontSize) nextStyle.fontSize = `${style.fontSize}px`;
  if (style.fontWeight) nextStyle.fontWeight = style.fontWeight;
  if (style.lineHeight) nextStyle.lineHeight = style.lineHeight;
  if (style.letterSpacing != null) nextStyle.letterSpacing = `${style.letterSpacing}px`;
  if (style.textTransform) nextStyle.textTransform = style.textTransform;
  if (style.color) nextStyle.color = style.color;
  return nextStyle;
}

export function cmsResponsiveStyle(style = {}, fallback = {}) {
  const nextStyle = { ...fallback, ...cmsTextStyle(style) };
  if (style.mobileFontSize) nextStyle['--mobile-font-size'] = `${style.mobileFontSize}px`;
  return nextStyle;
}
