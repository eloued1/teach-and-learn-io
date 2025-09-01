import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

export const InstructorDashboard = () => {
  const { courses } = useApp();
  const navigate = useNavigate();
  
  // Filter courses owned by current instructor (mock logic)
  const ownedCourses = courses.filter(course => course.instructor === "John Smith");

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleRemoveCourse = (courseId: string) => {
    // TODO: Implement course deletion
    console.log("Remove course:", courseId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your courses and track student progress
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Course</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border shadow-soft">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{ownedCourses.length}</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-soft">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {ownedCourses.reduce((sum, course) => sum + course.enrolled, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-soft">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold">📈</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round((ownedCourses.reduce((sum, course) => sum + course.enrolled, 0) / 
                  ownedCourses.reduce((sum, course) => sum + course.maxStudents, 0)) * 100) || 0}%
              </p>
              <p className="text-sm text-muted-foreground">Enrollment Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Your Courses</h2>
        {ownedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isOwned={true}
                onView={handleViewCourse}
                onRemove={handleRemoveCourse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6">Create your first course to get started</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};