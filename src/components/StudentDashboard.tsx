import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/CourseCard";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

export const StudentDashboard = () => {
  const { courses, enrolledCourses, setEnrolledCourses } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter available courses (not enrolled)
  const availableCourses = courses.filter(
    course => !enrolledCourses.some(enrolled => enrolled.id === course.id)
  );

  // Filter courses based on search
  const filteredAvailableCourses = availableCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnroll = (courseId: string) => {
    const courseToEnroll = courses.find(course => course.id === courseId);
    if (courseToEnroll && courseToEnroll.enrolled < courseToEnroll.maxStudents) {
      setEnrolledCourses([...enrolledCourses, courseToEnroll]);
      // TODO: Call backend API to enroll
      console.log("Enrolled in course:", courseId);
    }
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Continue your learning journey and discover new courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border shadow-soft">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{enrolledCourses.length}</p>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-soft">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold">🎯</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{availableCourses.length}</p>
              <p className="text-sm text-muted-foreground">Available Courses</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-soft">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold">🏆</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round((enrolledCourses.length / courses.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enrolled">My Courses ({enrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="available">Browse Courses ({availableCourses.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrolled" className="mt-6">
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={true}
                  onView={handleViewCourse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No enrolled courses</h3>
              <p className="text-muted-foreground mb-6">Start learning by enrolling in a course</p>
              <Button onClick={() => setSearchTerm("")}>Browse Courses</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available" className="mt-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {filteredAvailableCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  onView={handleViewCourse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};