const SN_THEME = 'riviera';

export const SN_THEMES = {
  riviera: { bg:'#FBF8F3', navBg:'rgba(251,248,243,.97)', navBorder:'rgba(42,26,18,.08)', navInk:'#22302A', accent:'#2A5C7A', accentText:'#fff', statsBg:'#2A5C7A', statsValCol:'white', statsLblCol:'rgba(255,255,255,.55)', heroRadius:24, heroPad:28, btnR:'100px', cardR:20, font:"'Plus Jakarta Sans','Segoe UI',sans-serif", headFont:"'Plus Jakarta Sans','Segoe UI',sans-serif", footerBg:'#0E2233' },
  luxury:  { bg:'#FEFDF8', navBg:'rgba(254,253,248,.97)', navBorder:'rgba(26,21,16,.07)', navInk:'#1A1510', accent:'#1A1510', accentText:'#FEFDF8', statsBg:'#1A1510', statsValCol:'#B87D20', statsLblCol:'rgba(254,253,248,.4)', heroRadius:0,  heroPad:0,  btnR:'100px', cardR:18, font:"'DM Sans','Segoe UI',sans-serif",   headFont:"'Cormorant Garamond',Georgia,serif", footerBg:'#100D09' },
  grove:   { bg:'#FAF7F0', navBg:'rgba(250,247,240,.97)', navBorder:'rgba(26,61,44,.1)',   navInk:'#1A3D2C', accent:'#1A3D2C', accentText:'#FAF7F0', statsBg:'#1A3D2C', statsValCol:'#B87D20', statsLblCol:'rgba(250,247,240,.45)', heroRadius:0,  heroPad:0,  btnR:'100px', cardR:18, font:"'DM Sans','Segoe UI',sans-serif",   headFont:"'Cormorant Garamond',Georgia,serif", footerBg:'#0F2518' },
};

export const T = SN_THEMES[SN_THEME as keyof typeof SN_THEMES] || SN_THEMES.riviera;
