export interface Testimonial {
  title: string
  text: string
  name: string
  role: string
  avatar?: string
  avatarColor: string
  initials: string
  rating: number
}

export interface TestimonialColumn {
  colClass: string
  items: Testimonial[]
}

export const TESTIMONIALS: TestimonialColumn[] = [
  {
    colClass: "md:mt-0",
    items: [
      {
        avatar: "https://i.pravatar.cc/150?u=derrick",
        avatarColor: "from-primary/20 to-indigo-500/20",
        initials: "DB",
        name: "Derrick Bowman",
        rating: 5,
        role: "CEO at PixelCraft Studios",
        text: '"SaaSy Land saved us a significant amount of time and resources. We were able to focus on our core business, thanks to its powerful features."',
        title: "Saved me a lot of time",
      },
      {
        avatar: "https://i.pravatar.cc/150?u=troy",
        avatarColor: "from-blue-500/20 to-cyan-500/20",
        initials: "TC",
        name: "Troy Castillo",
        rating: 5,
        role: "Software Architect at NexaCorp",
        text: '"For startups, SaaSy Land is the perfect choice for building Minimum Viable Products (MVPs). It offers a wide range of pre-designed components and layouts that are essential for a quick go-to-market strategy. It helped us save months of development time and resources. SaaSy Land gave us a competitive edge and allowed us to test our ideas in the real world faster."',
        title: "Perfect for MVPs",
      },
      {
        avatar: "https://i.pravatar.cc/150?u=darren",
        avatarColor: "from-emerald-500/20 to-teal-500/20",
        initials: "DM",
        name: "Darren Miller",
        rating: 5,
        role: "Senior Developer at Unicorn Labs",
        text: '"From the initial concept to the final product, the implementation quality was truly incredible. Kudos to the entire team for their dedication and expertise."',
        title: "Incredible implementation quality!",
      },
    ],
  },
  {
    colClass: "md:mt-16",
    items: [
      {
        avatar: "https://i.pravatar.cc/150?u=beth",
        avatarColor: "from-violet-500/20 to-purple-500/20",
        initials: "BC",
        name: "Beth Craig",
        rating: 5,
        role: "CTO at Web Wizardry Inc.",
        text: '"The customer support from SaaSy Land is exceptional. They\'ve been incredibly responsive and helpful throughout our journey. I just love their product and the way they handle it."',
        title: "Outstanding customer support",
      },
      {
        avatar: "https://i.pravatar.cc/150?u=jenny",
        avatarColor: "from-pink-500/20 to-rose-500/20",
        initials: "JB",
        name: "Jenny Black",
        rating: 5,
        role: "Product Manager at StellarSoft",
        text: "\"Love love LOVE this product! It's changed my life to the point, where I can't imagine starting a new project without it anymore. Wholeheartedly recommended.\"",
        title: "A game-changer for startups",
      },
      {
        avatar: "https://i.pravatar.cc/150?u=kevin",
        avatarColor: "from-amber-500/20 to-orange-500/20",
        initials: "KH",
        name: "Kevin Hamilton",
        rating: 5,
        role: "Junior Developer at Purple Dash",
        text: "\"It's a treasure trove of well-designed, responsive elements that significantly accelerated our development process. This enabled us to create complex features and interactive elements with ease. SaaSy Land not only saves us time but also ensures a consistent and professional look for our project. We couldn't be happier with the results.\"",
        title: "Speechless!",
      },
    ],
  },
  {
    colClass: "md:-mt-4",
    items: [
      {
        avatar: "https://i.pravatar.cc/150?u=alfredo",
        avatarColor: "from-indigo-500/20 to-blue-500/20",
        initials: "AB",
        name: "Alfredo Bradley",
        rating: 5,
        role: "Software Developer at PixelMiners",
        text: '"If you\'re a startup, SaaSy Land is a perfect choice. It offers the tools you need to create a top-notch product without the hassle."',
        title: "Cannot recommend it enough",
      },
      {
        avatar: "https://i.pravatar.cc/150?u=michelle",
        avatarColor: "from-cyan-500/20 to-emerald-500/20",
        initials: "MJ",
        name: "Michelle Jensen",
        rating: 5,
        role: "CEO at DevXpert Digital",
        text: '"Implementation quality at SaaSy Land is exceptional. It made creating complex features a breeze and saved us from spending a lot of time and money on development."',
        title: "Exceptional code quality",
      },
      {
        avatar: "https://i.pravatar.cc/150?u=rafal",
        avatarColor: "from-purple-500/20 to-pink-500/20",
        initials: "RK",
        name: "Rafał Kowalski",
        rating: 5,
        role: "Product Owner at WebTech Co.",
        text: '"Our experience with SaaSy Land has been nothing short of transformational. This platform has revolutionized our web development process, making it faster and more efficient than ever before. The features, tools, and support provided have exceeded our expectations, and we couldn\'t be happier with the results."',
        title: "Revolutionized Our Web Development Process",
      },
    ],
  },
]
