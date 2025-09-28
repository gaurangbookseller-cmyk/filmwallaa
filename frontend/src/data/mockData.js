// Mock data for Indian Cinema Review Site

// Featured Movies
export const featuredMovies = [
  {
    id: 1,
    title: "जवान",
    titleEng: "Jawan",
    year: 2023,
    rating: 4.5,
    genre: ["Action", "Thriller"],
    language: "Hindi",
    poster: "https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1200&h=600&fit=crop",
    director: "Atlee",
    cast: ["Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi"],
    synopsis: "A high-octane action thriller that follows a man's mission to rectify the wrongs in society...",
    reviewExcerpt: "Shah Rukh Khan delivers a powerhouse performance in this engaging social thriller...",
    trailerUrl: "https://www.youtube.com/watch?v=example1",
    industry: "Bollywood"
  },
  {
    id: 2,
    title: "ಕಂತಾರ",
    titleEng: "Kantara",
    year: 2022,
    rating: 4.8,
    genre: ["Action", "Drama", "Thriller"],
    language: "Kannada",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&h=600&fit=crop",
    director: "Rishab Shetty",
    cast: ["Rishab Shetty", "Sapthami Gowda", "Kishore"],
    synopsis: "A thrilling tale set in a fictional village where a conflict between man and nature unfolds...",
    reviewExcerpt: "A cinematic masterpiece that beautifully blends folklore with contemporary storytelling...",
    trailerUrl: "https://www.youtube.com/watch?v=example2",
    industry: "Sandalwood"
  },
  {
    id: 3,
    title: "वराह रुप",
    titleEng: "Varisu",
    year: 2023,
    rating: 4.2,
    genre: ["Action", "Drama"],
    language: "Tamil",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop",
    director: "Vamshi Paidipally",
    cast: ["Vijay", "Rashmika Mandanna", "Shaam"],
    synopsis: "A family entertainer that revolves around business dynamics and family relationships...",
    reviewExcerpt: "Vijay shines in this emotional family drama with stellar performances all around...",
    trailerUrl: "https://www.youtube.com/watch?v=example3",
    industry: "Kollywood"
  },
  {
    id: 4,
    title: "పతాన్",
    titleEng: "Pathaan",
    year: 2023,
    rating: 4.3,
    genre: ["Action", "Thriller", "Spy"],
    language: "Hindi",
    poster: "https://images.unsplash.com/photo-1574267432551-dc8b1b5ebf91?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop",
    director: "Siddharth Anand",
    cast: ["Shah Rukh Khan", "Deepika Padukone", "John Abraham"],
    synopsis: "An Indian spy takes on a mercenary who is hell-bent on ripping apart India's security apparatus...",
    reviewExcerpt: "A high-energy spy thriller that marks Shah Rukh Khan's triumphant return to action cinema...",
    trailerUrl: "https://www.youtube.com/watch?v=example4",
    industry: "Bollywood"
  }
];

// Latest Reviews
export const latestReviews = [
  {
    id: 1,
    movieId: 1,
    title: "जवान: A Socially Conscious Spectacle",
    titleEng: "Jawan: A Socially Conscious Spectacle",
    author: "Priya Sharma",
    date: "2024-01-15",
    rating: 4.5,
    excerpt: "Atlee crafts a compelling narrative that balances entertainment with social commentary. Shah Rukh Khan's dual role showcases his versatility...",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=800&h=400&fit=crop",
    tags: ["Bollywood", "Action", "Social Drama"]
  },
  {
    id: 2,
    movieId: 2,
    title: "कंतारा: फोकलोर मिट्स सिनेमा",
    titleEng: "Kantara: Folklore Meets Cinema",
    author: "Rajesh Kumar",
    date: "2024-01-12",
    rating: 4.8,
    excerpt: "Rishab Shetty has created something truly special - a film that honors tradition while delivering contemporary thrills...",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop",
    tags: ["Kannada Cinema", "Folklore", "Drama"]
  },
  {
    id: 3,
    movieId: 4,
    title: "पठान: एक्शन का बादशाह वापस",
    titleEng: "Pathaan: The King of Action Returns",
    author: "Anita Verma",
    date: "2024-01-10",
    rating: 4.3,
    excerpt: "Siddharth Anand delivers a visually stunning spy thriller that reestablishes Shah Rukh Khan as Bollywood's action hero...",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1574267432551-dc8b1b5ebf91?w=800&h=400&fit=crop",
    tags: ["Spy Thriller", "Action", "Bollywood"]
  }
];

// News Articles
export const newsArticles = [
  {
    id: 1,
    title: "साउथ सिनेमा का बॉलीवुड पर प्रभाव",
    titleEng: "The Impact of South Cinema on Bollywood",
    author: "Vikram Singh",
    date: "2024-01-18",
    category: "Industry Analysis",
    excerpt: "How regional cinema is reshaping the landscape of Indian entertainment...",
    image: "https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=600&h=300&fit=crop",
    readTime: "6 min read"
  },
  {
    id: 2,
    title: "OTT प्लेटफॉर्म्स और इंडियन सिनेमा",
    titleEng: "OTT Platforms and Indian Cinema",
    author: "Meera Nair",
    date: "2024-01-16",
    category: "Digital Trends",
    excerpt: "The streaming revolution and its impact on traditional cinema distribution...",
    image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&h=300&fit=crop",
    readTime: "5 min read"
  }
];

// Categories
export const categories = [
  { id: 1, name: "बॉलीवुड", nameEng: "Bollywood", count: 145 },
  { id: 2, name: "दक्षिण भारतीय", nameEng: "South Indian", count: 98 },
  { id: 3, name: "इंटरनेशनल", nameEng: "International", count: 76 },
  { id: 4, name: "वृत्तचित्र", nameEng: "Documentaries", count: 42 },
  { id: 5, name: "क्लासिक", nameEng: "Classics", count: 58 }
];

// User Reviews
export const userReviews = [
  {
    id: 1,
    movieId: 1,
    user: "अमित शर्मा",
    userEng: "Amit Sharma",
    rating: 5,
    date: "2024-01-14",
    review: "Outstanding performance by SRK! The social message is delivered perfectly without compromising on entertainment."
  },
  {
    id: 2,
    movieId: 2,
    user: "प्रिया पटेल",
    userEng: "Priya Patel",
    rating: 5,
    date: "2024-01-13",
    review: "Kantara is a masterpiece that showcases the rich cultural heritage of Karnataka through exceptional storytelling."
  }
];

// Popular searches
export const popularSearches = [
  "जवान रिव्यू", "कंतारा", "साउथ मूवीज", "नेटफ्लिक्स फिल्में", "बॉलीवुड न्यूज"
];

// Languages
export const supportedLanguages = [
  { code: 'hi', name: 'हिंदी', nameEng: 'Hindi' },
  { code: 'en', name: 'English', nameEng: 'English' },
  { code: 'ta', name: 'தமிழ்', nameEng: 'Tamil' },
  { code: 'te', name: 'తెలుగు', nameEng: 'Telugu' },
  { code: 'kn', name: 'ಕನ್ನಡ', nameEng: 'Kannada' },
  { code: 'ml', name: 'മലയാളം', nameEng: 'Malayalam' }
];

export default {
  featuredMovies,
  latestReviews,
  newsArticles,
  categories,
  userReviews,
  popularSearches,
  supportedLanguages
};