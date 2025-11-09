import {z} from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"]
export const courseStatuses = ["Draft", "Published", "Archieved"]
export const courseCategories = [
    // 💻 Development & IT
    "Web Development",
    "Mobile Development",
    "Game Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "DevOps",
    "Cybersecurity",
    "Software Testing",
    "Cloud Computing",

    // 💼 Business & Management
    "Business Management",
    "Entrepreneurship",
    "Project Management",
    "Sales",
    "Marketing",
    "Digital Marketing",
    "Finance",
    "Accounting",
    "Human Resources",
    "Leadership",

    // 🎨 Design & Creativity
    "Graphic Design",
    "UI/UX Design",
    "3D Modeling",
    "Animation",
    "Photography",
    "Video Production",

    // 🧠 Personal Development
    "Productivity",
    "Career Development",
    "Public Speaking",
    "Mindfulness",
    "Personal Finance",
    "Language Learning",

    // 📚 Education & Teaching
    "Teaching & Academics",
    "E-learning Design",
    "STEM Education",
    "Curriculum Development",

    // 🧮 Science & Engineering
    "Mathematics",
    "Physics",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Biotechnology",

    // 💊 Health & Medicine
    "Nutrition",
    "Fitness",
    "Mental Health",
    "Nursing",
    "Healthcare Management",

    // 🎵 Music & Art
    "Music Production",
    "Music Theory",
    "Drawing",
    "Painting",

    // 🌍 Lifestyle & Others
    "Cooking",
    "Travel",
    "Fashion",
    "Interior Design",
    "Sports Coaching"
];


export const courseSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Атауы кемінде 3 таңбадан тұруы керек" })
        .max(100, { message: "Атауы 100 таңбадан аспауы керек" }),

    description: z
        .string()
        .min(3, { message: "Сипаттама кемінде 3 таңбадан тұруы керек" }),

    fileKey: z
        .string()
        .min(1, { message: "Файлды жүктеу қажет" }),

    price: z
        .coerce.number<number>()
        .min(1, { message: "Баға 1 немесе одан жоғары болуы керек" }),

    duration: z
        .coerce.number<number>()
        .min(1, { message: "Ұзақтығы 1 сағаттан кем болмауы керек" })
        .max(500, { message: "Ұзақтығы 500 сағаттан аспауы керек" }),

    level: z.enum(courseLevels, { message: "Курс деңгейін таңдаңыз" }),

    category: z
        .enum(courseCategories, { message: "Категорияны таңдаңыз" }),

    smallDescription: z
        .string()
        .min(3, { message: "Қысқаша сипаттама кемінде 3 таңбадан тұруы керек" })
        .max(200, { message: "Қысқаша сипаттама 200 таңбадан аспауы керек" }),

    slug: z
        .string()
        .min(3, { message: "Slug кемінде 3 таңбадан тұруы керек" }),

    status: z.enum(courseStatuses, { message: "Курс күйін таңдаңыз" })
});

export const chapterSchema = z.object({
    name: z.string()
        .min(3, {message: "Name must be at least 3 characters"}),
    courseId: z.uuid()
})

export type CourseSchemaInputType = z.input<typeof courseSchema>
export type CourseSchemaOutputType = z.output<typeof courseSchema>

export type ChapterSchemaInputType = z.input<typeof chapterSchema>
export type ChapterSchemaOutputType = z.output<typeof chapterSchema>
