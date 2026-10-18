interface TimelineItemProps {
    year: string;
    title: string;
    description: string;
}

export const ExperienceTimeline = () => {
    const experiences: TimelineItemProps[] = [
        {
            year: "2024",
            title: "Full-Stack Developer",
            description: "Completed intensive 6-month Full-Stack Development program at Workintech"
        },
        {
            year: "2023",
            title: "Mechanical Engineering",
            description: "Graduated from Marmara University with a degree in Mechanical Engineering"
        }
    ];

    return (
        <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
            {experiences.map((exp, index) => (
                <div key={index} className="ml-12 mb-8 relative">
                    <div className="absolute left-[7px] top-0 h-full w-0.5 bg-gray-200"></div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <span className="text-blue-500 font-semibold">{exp.year}</span>
                        <h3 className="text-lg font-semibold mt-1">{exp.title}</h3>
                        <p className="text-gray-600 mt-1">{exp.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )};