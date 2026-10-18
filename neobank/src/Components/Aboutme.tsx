import { useNavigate } from "react-router-dom"
import { Footer } from "../Layers/Footer"
import { Header } from "../Layers/Header"
import { AboutMeHeader } from "../Layers/AboutMeHeader"
import { SkillCard } from "../Layers/SkillCard"
import { ExperienceTimeline } from "../Layers/ExperienceTimeline"
import front from "../assets/frontend.jpg";
import back from "../assets/backend.jpeg";
import tool from "../assets/devtools.png";

export const Aboutme = () => {
    const navigate = useNavigate();

    const onClick = (url: string):void => {
        navigate(url);
    }

    const skillSets = [
        {
            icon: front,
            title: "Front-End Development",
            skills: [
                "JavaScript & TypeScript",
                "React.js with Redux",
                "HTML5 & CSS3",
                "Tailwind CSS",
                "Responsive Design"
            ]
        },
        {
            icon: back,
            title: "Back-End Development",
            skills: [
                "Java Spring Boot",
                "Spring Security",
                "PostgreSQL",
                "RESTful APIs",
                "Database Design"
            ]
        },
        {
            icon: tool,
            title: "Tools & Practices",
            skills: [
                "Git Version Control",
                "Object-Oriented Programming",
                "Design Patterns",
                "Agile Methodology",
                "Problem Solving"
            ]
        }
    ];

    return (
        <div className="flex flex-col w-full items-center min-h-screen">
            <Header onClick={onClick}/>
            <main className="w-full max-w-6xl px-4 py-12 space-y-12">
                <AboutMeHeader 
                    title="About Me"
                    subtitle="Full-Stack Developer with Engineering Background"
                />
                
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        I am a Full-Stack Developer with a unique background in Mechanical Engineering from Marmara University. After graduating, I pursued my passion for software development through Workintech's intensive 6-month Full-Stack Development program, completing numerous projects and building a strong foundation in both front-end and back-end technologies.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        My engineering background provides me with strong analytical and problem-solving skills, which I combine with modern software development practices to create efficient, user-friendly solutions. I focus on writing clean, maintainable code and building responsive applications that deliver excellent user experiences.
                    </p>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {skillSets.map((skillSet, index) => (
                        <SkillCard key={index} {...skillSet} />
                    ))}
                </section>

                <section className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">My Journey</h2>
                    <ExperienceTimeline />
                </section>
            </main>
            <Footer/>
        </div>
    );
}