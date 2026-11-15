import sportsTeeImg from '../assets/images/product_sports_tee_1794662473792.jpg';
import athleticJerseyImg from '../assets/images/product_athletic_jersey_1794662472828.jpg';
import dryFitTopImg from '../assets/images/product_dryfit_top_1794662473344.jpg';
import performanceShortsImg from '../assets/images/product_performance_shorts_1794662473933.jpg';
import trackpantsImg from '../assets/images/product_trackpants_1794662474420.jpg';
import lookbookAthleteImg from '../assets/images/lookbook_athlete_motion_1794662473635.jpg';

import type {
  BuyerReview,
  FabricLabMetric,
  LookbookItem,
  Product,
  ProductCategory,
  UnisexSize,
} from '../types/store';

export const BRAND_ASSETS = {
  runnerHero: '/assets/aistudio/IMG_0194_2_05260b0e.jpg',
  unisexRack: '/assets/aistudio/IMG_0275_2_2a8fb5b4.PNG',
  unboxingKit: '/assets/aistudio/7DBBE2C2-2DDD-415C-9C62-8F5A3DA5818E_2_a7300d5e.jpg',
  lookbookAthlete: lookbookAthleteImg,
};

export const CATEGORIES: ('All Essentials' | ProductCategory)[] = [
  'All Essentials',
  'Sports T-Shirts',
  'Jerseys',
  'Dry-Fits',
  'Shorts',
  'Trackpants',
  'Capsule Sets',
];

export const UNISEX_SIZES: UnisexSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const UNISEX_SIZE_CHART: {
  size: UnisexSize;
  chestCm: string;
  chestIn: string;
  waistCm: string;
  waistIn: string;
  lengthCm: string;
  lengthIn: string;
  fitNote: string;
}[] = [
  { size: 'XS', chestCm: '88 - 93', chestIn: '34.5 - 36.5', waistCm: '68 - 73', waistIn: '27 - 29', lengthCm: '66', lengthIn: '26.0', fitNote: '5\'2" - 5\'6"' },
  { size: 'S', chestCm: '94 - 99', chestIn: '37.0 - 39.0', waistCm: '74 - 79', waistIn: '29 - 31', lengthCm: '68.5', lengthIn: '27.0', fitNote: '5\'5" - 5\'8"' },
  { size: 'M', chestCm: '100 - 105', chestIn: '39.5 - 41.5', waistCm: '80 - 85', waistIn: '31.5 - 33.5', lengthCm: '71', lengthIn: '28.0', fitNote: '5\'8" - 5\'11"' },
  { size: 'L', chestCm: '106 - 112', chestIn: '41.5 - 44.0', waistCm: '86 - 92', waistIn: '34 - 36', lengthCm: '73.5', lengthIn: '29.0', fitNote: '5\'10" - 6\'1"' },
  { size: 'XL', chestCm: '113 - 119', chestIn: '44.5 - 47.0', waistCm: '93 - 99', waistIn: '36.5 - 39', lengthCm: '76', lengthIn: '30.0', fitNote: '6\'0" - 6\'3"' },
  { size: 'XXL', chestCm: '120 - 126', chestIn: '47.5 - 49.5', waistCm: '100 - 106', waistIn: '39.5 - 42', lengthCm: '78', lengthIn: '30.7', fitNote: '6\'2" - 6\'5"' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'sty-stride-tee',
    name: 'Stride Interlock Sports Tee',
    category: 'Sports T-Shirts',
    priceInr: 1399,
    gsm: 165,
    fabricBlend: '92% AeroWeave Micro-Polyester · 8% Elastane',
    fitType: 'Relaxed Unisex',
    tagline: 'Zero-cling everyday performance',
    description:
      'Engineered from 165 GSM micro-interlock polyester with flatlock shoulder seams so it moves cleanly from high-output track intervals to daily studio errands.',
    breathabilityCfm: 48,
    wickTimeSec: 3.2,
    rating: 4.9,
    reviewCount: 318,
    isFeatured: true,
    colors: [
      { name: 'Obsidian Charcoal', hex: '#23262B', image: sportsTeeImg },
      { name: 'Slate Blue', hex: '#4A5D75', image: dryFitTopImg },
      { name: 'Sage Mist', hex: '#768473', image: dryFitTopImg },
      { name: 'Terracotta Clay', hex: '#9E543D', image: dryFitTopImg },
      { name: 'Warm Sand', hex: '#C6BBA8', image: dryFitTopImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      '165 GSM double-knit AeroWeave micro-polyester',
      '3.2-second moisture dispersion with zero wet-cling',
      'Anti-chafe flatlock shoulder architecture',
      'UPF 50+ sun shield & odor-resistant silver finish',
    ],
  },
  {
    id: 'sty-vanguard-jersey',
    name: 'Vanguard Mesh Training Jersey',
    category: 'Jerseys',
    priceInr: 1899,
    gsm: 145,
    fabricBlend: '100% Micro-Perforated Technical Polyester',
    fitType: 'Athletic Unisex',
    tagline: 'Open-grid airflow for peak sessions',
    description:
      'Featherlight 145 GSM pinhole mesh polyester framed with subtle bronze seam piping. Built to release core heat rapidly during tempo runs and court drills.',
    breathabilityCfm: 64,
    wickTimeSec: 2.6,
    rating: 4.9,
    reviewCount: 194,
    isFeatured: true,
    colors: [
      { name: 'Forest Olive', hex: '#384637', image: athleticJerseyImg },
      { name: 'Obsidian Black', hex: '#1B1D21', image: sportsTeeImg },
      { name: 'Plum Dusk', hex: '#543D48', image: athleticJerseyImg },
      { name: 'Midnight Navy', hex: '#222F42', image: athleticJerseyImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      '64 CFM open-cell pinhole polyester ventilation',
      'Matte bronze raglan piping for full overhead reach',
      'Droptail hem stays anchored through sprints',
      'Retains crisp collar tension across 100+ washes',
    ],
  },
  {
    id: 'sty-aeroweave-dryfit',
    name: 'AeroWeave Everyday Dry-Fit',
    category: 'Dry-Fits',
    priceInr: 1299,
    gsm: 150,
    fabricBlend: '94% Quick-Dry Micro-Polyester · 6% Spandex',
    fitType: 'Tailored Unisex',
    tagline: 'Signature drape in six mineral hues',
    description:
      'Our foundational everyday dry-fit tee. Soft matte finish looks like tailored knitwear while wicking sweat 3x faster than combed cotton.',
    breathabilityCfm: 52,
    wickTimeSec: 2.9,
    rating: 4.9,
    reviewCount: 486,
    isFeatured: true,
    colors: [
      { name: 'Sage Mist', hex: '#768473', image: dryFitTopImg },
      { name: 'Slate Blue', hex: '#4A5D75', image: dryFitTopImg },
      { name: 'Terracotta Clay', hex: '#9E543D', image: dryFitTopImg },
      { name: 'Plum Dusk', hex: '#543D48', image: dryFitTopImg },
      { name: 'Forest Olive', hex: '#384637', image: dryFitTopImg },
      { name: 'Obsidian Charcoal', hex: '#23262B', image: sportsTeeImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      'Soft-touch matte polyester without synthetic shine',
      '4-way stretch gusseted underarm panel',
      'Wrinkle-resistant packability for gym duffels & travel',
      'Tagless neck transfer for irritation-free wear',
    ],
  },
  {
    id: 'sty-pace-shorts',
    name: 'Pace 7" Performance Shorts',
    category: 'Shorts',
    priceInr: 1699,
    gsm: 160,
    fabricBlend: '88% 4-Way Stretch Woven Polyester · 12% Elastane',
    fitType: 'Unisex 7" Inseam',
    tagline: 'Linerless versatility with zip security',
    description:
      'Clean 7-inch unisex shorts cut from water-repellent stretch polyester. Features a brushed internal drawcord and concealed YKK zip pocket for keys or phone.',
    breathabilityCfm: 44,
    wickTimeSec: 3.4,
    rating: 4.8,
    reviewCount: 247,
    isFeatured: true,
    colors: [
      { name: 'Charcoal Slate', hex: '#2D3035', image: performanceShortsImg },
      { name: 'Forest Olive', hex: '#384637', image: performanceShortsImg },
      { name: 'Midnight Navy', hex: '#222F42', image: performanceShortsImg },
      { name: 'Warm Sand', hex: '#C6BBA8', image: performanceShortsImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      '4-way stretch woven polyester sheds light rain & sweat',
      'Zero-bounce concealed zippered side pocket',
      'Laser-finished split hem for unrestricted squats & strides',
      'Matte tonal tipped drawcord',
    ],
  },
  {
    id: 'sty-transit-trackpants',
    name: 'Transit Tapered Trackpants',
    category: 'Trackpants',
    priceInr: 2799,
    gsm: 220,
    fabricBlend: '90% Double-Knit Stretch Polyester · 10% Elastane',
    fitType: 'Tapered Unisex',
    tagline: 'Architectural drape from track to terminal',
    description:
      'Substantial 220 GSM structured double-knit polyester with articulated knee darts and clean ankle cuffs. Moves like track gear, reads like tailored trousers.',
    breathabilityCfm: 39,
    wickTimeSec: 3.8,
    rating: 4.9,
    reviewCount: 215,
    isFeatured: true,
    colors: [
      { name: 'Midnight Navy', hex: '#222F42', image: trackpantsImg },
      { name: 'Obsidian Charcoal', hex: '#23262B', image: trackpantsImg },
      { name: 'Forest Olive', hex: '#384637', image: trackpantsImg },
      { name: 'Warm Sand', hex: '#C6BBA8', image: trackpantsImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      '220 GSM structured double-knit polyester prevents knee bagging',
      'Articulated knee paneling for natural athletic flexion',
      'Dual zippered security pockets + breathable waistband',
      'Clean tapered cuff pairs seamlessly with runners or sneakers',
    ],
  },
  {
    id: 'sty-apex-raglan',
    name: 'Apex Tempo Raglan Tee',
    category: 'Sports T-Shirts',
    priceInr: 1549,
    gsm: 155,
    fabricBlend: '91% Jacquard Micro-Polyester · 9% Elastane',
    fitType: 'Relaxed Unisex',
    tagline: 'Zoned sweat mapping across spine & chest',
    description:
      'Dual-density polyester knit engineered with denser weave across the chest for daily poise and micro-vented back zones where heat concentrates.',
    breathabilityCfm: 55,
    wickTimeSec: 2.8,
    rating: 4.8,
    reviewCount: 142,
    colors: [
      { name: 'Obsidian Charcoal', hex: '#23262B', image: sportsTeeImg },
      { name: 'Terracotta Clay', hex: '#9E543D', image: dryFitTopImg },
      { name: 'Sage Mist', hex: '#768473', image: dryFitTopImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      'Body-mapped jacquard polyester airflow channels',
      'Raglan sleeve geometry eliminates shoulder seam friction',
      '360-degree reflective micro-piping for dawn runs',
    ],
  },
  {
    id: 'sty-studio-trackpants',
    name: 'Studio Warm-Up Trackpants',
    category: 'Trackpants',
    priceInr: 2499,
    gsm: 205,
    fabricBlend: '93% Matte Interlock Polyester · 7% Elastane',
    fitType: 'Straight-Relaxed Unisex',
    tagline: 'Lighter-weight daily movement trouser',
    description:
      'A sleeker 205 GSM warm-up silhouette built for humid climates, travel days, and mobility sessions where breathability matters as much as structure.',
    breathabilityCfm: 43,
    wickTimeSec: 3.5,
    rating: 4.8,
    reviewCount: 109,
    colors: [
      { name: 'Obsidian Charcoal', hex: '#23262B', image: trackpantsImg },
      { name: 'Slate Blue', hex: '#4A5D75', image: trackpantsImg },
      { name: 'Forest Olive', hex: '#384637', image: trackpantsImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      '205 GSM breathable interlock polyester for year-round wear',
      'Encased flat-elastic waist with internal drawcord',
      'Quick-dry finish dries in under 25 minutes post-wash',
    ],
  },
  {
    id: 'sty-velocity-dryfit',
    name: 'Velocity Raglan Dry-Fit',
    category: 'Dry-Fits',
    priceInr: 1449,
    gsm: 145,
    fabricBlend: '95% Featherweight Micro-Polyester · 5% Elastane',
    fitType: 'Athletic Unisex',
    tagline: 'Chafe-free underarm gusset for long runs',
    description:
      'Cut slightly lighter at 145 GSM for humid tempo days and endurance sessions. Mapped shoulder seams keep pack straps and barbell bars comfortable.',
    breathabilityCfm: 58,
    wickTimeSec: 2.7,
    rating: 4.9,
    reviewCount: 178,
    colors: [
      { name: 'Midnight Navy', hex: '#222F42', image: dryFitTopImg },
      { name: 'Sage Mist', hex: '#768473', image: dryFitTopImg },
      { name: 'Obsidian Charcoal', hex: '#23262B', image: sportsTeeImg },
      { name: 'Warm Sand', hex: '#C6BBA8', image: dryFitTopImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      '145 GSM ultralight feather-wick polyester',
      'Bonded flatlock shoulder seams for zero chafe',
      'Dropped back hem stays anchored on sprints',
    ],
  },
  {
    id: 'sty-kinetic-jersey',
    name: 'Kinetic Mock-Neck Training Jersey',
    category: 'Jerseys',
    priceInr: 1999,
    gsm: 155,
    fabricBlend: '100% Honeycomb Technical Polyester',
    fitType: 'Tailored Unisex',
    tagline: 'Structured collar with honeycomb heat release',
    description:
      'Built for turf intervals, padel courts, and late-night warmups. Honeycomb micro-mesh channels heat away from the upper back while holding a clean collar frame.',
    breathabilityCfm: 60,
    wickTimeSec: 2.8,
    rating: 4.8,
    reviewCount: 126,
    colors: [
      { name: 'Obsidian Charcoal', hex: '#23262B', image: athleticJerseyImg },
      { name: 'Slate Blue', hex: '#4A5D75', image: athleticJerseyImg },
      { name: 'Forest Olive', hex: '#384637', image: athleticJerseyImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      '60 CFM honeycomb mesh back ventilation',
      'Structured low-profile mock collar',
      'Sweat-wicking bronze-tipped side gussets',
    ],
  },
  {
    id: 'sty-tempo-shorts',
    name: 'Tempo 5" Split Runner Shorts',
    category: 'Shorts',
    priceInr: 1549,
    gsm: 140,
    fabricBlend: '89% Ultralight Woven Polyester · 11% Elastane',
    fitType: 'Unisex 5" Inseam',
    tagline: 'Featherlight stride cut with gel stash pocket',
    description:
      'Shorter 5-inch track silhouette engineered for race pace and hot-weather intervals. Quick-shed DWR polyester dries almost instantaneously.',
    breathabilityCfm: 50,
    wickTimeSec: 2.9,
    rating: 4.9,
    reviewCount: 163,
    colors: [
      { name: 'Obsidian Charcoal', hex: '#23262B', image: performanceShortsImg },
      { name: 'Midnight Navy', hex: '#222F42', image: performanceShortsImg },
      { name: 'Terracotta Clay', hex: '#9E543D', image: performanceShortsImg },
      { name: 'Sage Mist', hex: '#768473', image: performanceShortsImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      '140 GSM ultralight 4-way stretch runner weave',
      'Notched outer leg vent for full stride range',
      'Concealed zip rear pocket for cards & keys',
    ],
  },
  {
    id: 'sty-capsule-trio',
    name: 'Everyday Dry-Fit Trio Box',
    category: 'Capsule Sets',
    priceInr: 2899,
    compareAtInr: 3897,
    gsm: 150,
    fabricBlend: '3 × AeroWeave Micro-Polyester Tees (Gift Boxed)',
    fitType: 'Tailored Unisex',
    tagline: 'Three core mineral tees · Save ₹998',
    description:
      'Curated rotation of three AeroWeave Everyday Dry-Fits presented in our signature dusk-and-bronze collector gift box. Built for Monday sprints through Sunday recovery.',
    breathabilityCfm: 52,
    wickTimeSec: 2.9,
    rating: 5.0,
    reviewCount: 164,
    isBundle: true,
    bundleSummary: 'Includes 3 Dry-Fit Tees + Gift Box',
    colors: [
      { name: 'Mineral Trio (Sage · Slate · Clay)', hex: '#768473', image: dryFitTopImg },
      { name: 'Earth Trio (Plum · Forest · Sand)', hex: '#543D48', image: BRAND_ASSETS.unboxingKit },
      { name: 'Monochrome Trio (Obsidian · Slate)', hex: '#23262B', image: sportsTeeImg },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      'Save ₹998 compared to individual tee pricing',
      'Delivered in Stylesse rigid collector presentation box',
      '98.4% shape retention & fade-locked mineral dyes',
    ],
  },
  {
    id: 'sty-capsule-kit',
    name: 'Track-to-Street Capsule Kit',
    category: 'Capsule Sets',
    priceInr: 2999,
    compareAtInr: 4198,
    gsm: 195,
    fabricBlend: 'Stride Tee + Transit Trackpants Set',
    fitType: 'Unisex Coordinated Fit',
    tagline: 'Complete head-to-ankle set · Save ₹1,199',
    description:
      'Our flagship two-piece uniform combining the Stride Interlock Sports Tee and Transit Tapered Trackpants in a coordinated tonal palette.',
    breathabilityCfm: 45,
    wickTimeSec: 3.3,
    rating: 4.9,
    reviewCount: 138,
    isBundle: true,
    bundleSummary: 'Includes Sports Tee + Tapered Trackpants',
    colors: [
      { name: 'Midnight & Obsidian', hex: '#222F42', image: trackpantsImg },
      { name: 'Forest & Charcoal', hex: '#384637', image: BRAND_ASSETS.unboxingKit },
      { name: 'Slate & Sand', hex: '#4A5D75', image: BRAND_ASSETS.unisexRack },
    ],
    sizes: UNISEX_SIZES,
    highlights: [
      'Save ₹1,199 on our most-ordered everyday athlete pairing',
      'Matched tonal dye lots across top and bottom',
      'Ships in presentation kit with fabric care card',
    ],
  },
];

export const FABRIC_LAB_METRICS: FabricLabMetric[] = [
  {
    id: 'moisture',
    title: 'Moisture Wick',
    headline: '3.2-Second Capillary Sweat Dispersion',
    summary:
      'Hydrophobic micro-polyester filaments draw moisture off the skin into a wide outer evaporation surface—eliminating heavy wet patches mid-session.',
    stylesseValue: '3.2 sec dry-wick',
    stylessePercent: 94,
    cottonValue: '42 sec (retains weight)',
    cottonPercent: 26,
    standardPolyValue: '11.5 sec',
    standardPolyPercent: 62,
    specNotes: [
      { label: 'Fabric Weight', value: '150 - 220 GSM' },
      { label: 'Drying Speed', value: '3.1x Faster vs Cotton' },
      { label: 'Cling Index', value: '0% Wet Stickiness' },
    ],
  },
  {
    id: 'airflow',
    title: 'Airflow Matrix',
    headline: '48 - 64 CFM Micro-Ventilation',
    summary:
      'Engineered open-interlock channels circulate ambient air continuously across torso heat zones without making the garment sheer or fragile.',
    stylesseValue: '54 CFM avg',
    stylessePercent: 92,
    cottonValue: '19 CFM',
    cottonPercent: 34,
    standardPolyValue: '31 CFM',
    standardPolyPercent: 56,
    specNotes: [
      { label: 'Jersey Mesh Peak', value: '64 CFM' },
      { label: 'UV Protection', value: 'UPF 50+ Rated' },
      { label: 'Opacity Rating', value: '100% Zero-Sheer' },
    ],
  },
  {
    id: 'stretch',
    title: '4-Way Stretch',
    headline: '98.4% Elastic Recovery After 100 Washes',
    summary:
      'High-gauge polyester blended with mechanical elastane rebounds instantly after deep squats, overhead lifts, and long-haul travel without knee or collar sag.',
    stylesseValue: '98.4% recovery',
    stylessePercent: 98,
    cottonValue: '71.0% recovery',
    cottonPercent: 48,
    standardPolyValue: '84.5% recovery',
    standardPolyPercent: 72,
    specNotes: [
      { label: 'Stretch Axis', value: '4-Way Mechanical' },
      { label: 'Seam Construction', value: 'Flatlock Reinforced' },
      { label: 'Shrinkage Tolerance', value: '< 0.5% Cold Wash' },
    ],
  },
  {
    id: 'freshness',
    title: 'Zero-Cling Finish',
    headline: 'Silver-Ion Freshness & Matte Drape',
    summary:
      'No glossy plastic sheen. Our brushed matte polyester resists odor-causing bacteria across double training days and folds wrinkle-free straight out of a duffel.',
    stylesseValue: '48 hr odor shield',
    stylessePercent: 95,
    cottonValue: '6 hr threshold',
    cottonPercent: 28,
    standardPolyValue: '14 hr threshold',
    standardPolyPercent: 50,
    specNotes: [
      { label: 'Surface Finish', value: 'Brushed Matte Peach' },
      { label: 'Odor Control', value: 'Silver-Ion Treated' },
      { label: 'Wrinkle Recovery', value: 'Pack & Wear Ready' },
    ],
  },
];

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'look-morning-track',
    title: '06:15 AM · Track Tempo & Coffee Run',
    context: 'Morning Track',
    athleteNote:
      '"I train at sunrise and walk straight into studio meetings. The Sage Dry-Fit dries before I reach my car, and the shorts stay structured all day."',
    modelStats: 'Aanya · 5\'7" · Wears Unisex S',
    image: BRAND_ASSETS.lookbookAthlete,
    productIds: ['sty-aeroweave-dryfit', 'sty-pace-shorts'],
    bundlePriceInr: 2998,
  },
  {
    id: 'look-wardrobe-rack',
    title: 'Daily Uniform · Neutral Capsule Rotation',
    context: 'Everyday Essentials',
    athleteNote:
      '"Unisex cuts mean zero guesswork. Clean neckline, rich muted colors, and zero loud logos—just pieces you reach for five mornings a week."',
    modelStats: 'Studio Rack · Sizes XS to XXL',
    image: BRAND_ASSETS.unisexRack,
    productIds: ['sty-capsule-kit'],
    bundlePriceInr: 2999,
  },
  {
    id: 'look-collector-kit',
    title: 'Collector Kit · Built Different. Made To Move.',
    context: 'Unboxing & Gift Kits',
    athleteNote:
      '"Ordered the Trio Box for marathon prep—the matte presentation boxes and fabric swatch tags make it feel like a bespoke athletic house."',
    modelStats: '6 Mineral Colorways · Gift Ready',
    image: BRAND_ASSETS.unboxingKit,
    productIds: ['sty-capsule-trio'],
    bundlePriceInr: 2899,
  },
];

export const BUYER_REVIEWS: BuyerReview[] = [
  {
    id: 'rev-1',
    name: 'Rohan Kulkarni',
    role: 'Half-Marathoner & Architect',
    city: 'Bengaluru',
    heightAndSize: '5\'11" · Wears Unisex L',
    category: 'Dry-Fits',
    productName: 'AeroWeave Everyday Dry-Fit',
    rating: 5,
    fitVerdict: 'True to Size',
    quote:
      'Polyester tees usually feel plasticky or trap odor after one humid 10K. Stylesse feels like fine matte cotton against the skin and dries completely in minutes.',
    outcome: 'Purchased 4 additional colors after first 200 km of training.',
  },
  {
    id: 'rev-2',
    name: 'Meera Nair',
    role: 'Strength Coach',
    city: 'Mumbai',
    heightAndSize: '5\'6" · Wears Unisex S',
    category: 'Trackpants',
    productName: 'Transit Tapered Trackpants',
    rating: 5,
    fitVerdict: 'True to Size',
    quote:
      'Most trackpants bag out at the knees after three coaching sessions. The 220 GSM double-knit holds a crisp tapered silhouette from 6 AM squats through evening transit.',
    outcome: 'Zero knee sag after 40+ washes; zipped pockets lock phone securely.',
  },
  {
    id: 'rev-3',
    name: 'Kabir Deshmukh',
    role: 'Club Sprinter & Physio',
    city: 'Pune',
    heightAndSize: '5\'9" · Wears Unisex M',
    category: 'Jerseys',
    productName: 'Vanguard Mesh Training Jersey',
    rating: 5,
    fitVerdict: 'Relaxed Drape',
    quote:
      'The pinhole airflow is unreal during afternoon track blocks. Forest Olive with the subtle bronze piping looks sharp enough to wear out post-session.',
    outcome: 'Replaced entire training rotation with Vanguard & Pace Shorts.',
  },
  {
    id: 'rev-4',
    name: 'Ananya Verma',
    role: 'Product Designer & Runner',
    city: 'Delhi NCR',
    heightAndSize: '5\'4" · Wears Unisex XS',
    category: 'Shorts',
    productName: 'Pace 7" Performance Shorts',
    rating: 5,
    fitVerdict: 'True to Size',
    quote:
      'Finally unisex shorts with thoughtful proportions—the waistband sits flat without rolling, and the unboxing box arrived ready to gift.',
    outcome: 'Ordered via COD; exchanged size in 48h with zero friction.',
  },
  {
    id: 'rev-5',
    name: 'Devansh Joshi',
    role: 'Endurance Cyclist',
    city: 'Ahmedabad',
    heightAndSize: '6\'0" · Wears Unisex L',
    category: 'Sports T-Shirts',
    productName: 'Stride Interlock Sports Tee',
    rating: 5,
    fitVerdict: 'True to Size',
    quote:
      'Wore Obsidian Charcoal through a 40 km coastal ride and straight into client studio reviews. Zero collar bacon and zero sweat marks visible.',
    outcome: 'Over 60 cold washes with identical matte finish and shape.',
  },
  {
    id: 'rev-6',
    name: 'Tanya Kapoor',
    role: 'Pilates & Mobility Instructor',
    city: 'Chandigarh',
    heightAndSize: '5\'5" · Wears Unisex S',
    category: 'Trackpants',
    productName: 'Studio Warm-Up Trackpants',
    rating: 5,
    fitVerdict: 'True to Size',
    quote:
      'The Slate Blue interlock hangs like tailored menswear trousers while still giving complete hip mobility through six back-to-back classes.',
    outcome: 'Dries in under 25 minutes between evening and morning batches.',
  },
  {
    id: 'rev-7',
    name: 'Arjun Menon',
    role: 'Badminton Doubles Player',
    city: 'Kochi',
    heightAndSize: '5\'10" · Wears Unisex M',
    category: 'Jerseys',
    productName: 'Vanguard Mesh Training Jersey',
    rating: 5,
    fitVerdict: 'Relaxed Drape',
    quote:
      'Kerala humidity destroys ordinary cotton-poly blends inside twenty minutes. The 64 CFM pinhole mesh genuinely breathes across every overhead smash.',
    outcome: 'Ordered Plum Dusk and Midnight Navy for tournament weekends.',
  },
  {
    id: 'rev-8',
    name: 'Niharika Sen',
    role: 'Track Coach & Creative Director',
    city: 'Kolkata',
    heightAndSize: '5\'7" · Wears Unisex M',
    category: 'Dry-Fits',
    productName: 'AeroWeave Everyday Dry-Fit',
    rating: 5,
    fitVerdict: 'True to Size',
    quote:
      'Picked up the Mineral Trio box for morning intervals and travel days. Terracotta Clay and Sage Mist hold rich, matte color without any synthetic sheen.',
    outcome: 'Packs flat in cabin luggage with zero creases out of the bag.',
  },
];

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
