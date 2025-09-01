import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, BookOpen, Download, Upload, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";

// Mock student data
const mockStudents = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', enrolledAt: '2024-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', enrolledAt: '2024-01-18' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', enrolledAt: '2024-01-20' },
];

// Mock PDF data
const mockPDFs = [
  { id: '1', name: 'Introduction to React.pdf', url: '#', uploadedAt: '2024-01-10' },
  { id: '2', name: 'React Components Guide.pdf', url: '#', uploadedAt: '2024-01-12' },
  { id: '3', name: 'State Management.pdf', url: '#', uploadedAt: '2024-01-15' },
];

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, userRole, enrolledCourses } = useApp();
  
  const course = courses.find(c => c.id === id);
  const isEnrolled = enrolledCourses.some(c => c.id === id);
  const isOwned = course?.instructor === "John Smith" && userRole === 'instructor'; // Mock logic
  
  const [students] = useState(mockStudents);
  const [pdfs] = useState(mockPDFs);

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleRemoveStudent = (studentId: string) => {
    // TODO: Implement student removal
    console.log("Remove student:", studentId);
  };

  const handleDownloadPDF = (pdfUrl: string, pdfName: string) => {
    // TODO: Implement PDF download
    console.log("Download PDF:", pdfName);
  };

  const handleUploadPDF = () => {
    // TODO: Implement PDF upload
    console.log("Upload PDF");
  };

  const handleDeletePDF = (pdfId: string) => {
    // TODO: Implement PDF deletion
    console.log("Delete PDF:", pdfId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
            </div>
            <div className="flex gap-2">
              {isEnrolled && (
                <Badge variant="secondary">Enrolled</Badge>
              )}
              {isOwned && (
                <Badge variant="default">Your Course</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Instructor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">{course.instructor}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Enrollment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">
                {course.enrolled} / {course.maxStudents} students
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={course.enrolled >= course.maxStudents ? "destructive" : "default"}>
                {course.enrolled >= course.maxStudents ? "Full" : "Open"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Materials (PDFs) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Materials
                </CardTitle>
                {isOwned && (
                  <Button size="sm" onClick={handleUploadPDF}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {pdfs.length > 0 ? (
                <div className="space-y-3">
                  {pdfs.map((pdf, index) => (
                    <div key={pdf.id}>
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{pdf.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(pdf.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(isEnrolled || isOwned) && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadPDF(pdf.url, pdf.name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {isOwned && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeletePDF(pdf.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < pdfs.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No materials uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enrolled Students (Instructor only) */}
          {isOwned && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Enrolled Students ({students.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-3">
                    {students.map((student, index) => (
                      <div key={student.id}>
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Enrolled {new Date(student.enrolledAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRemoveStudent(student.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        {index < students.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No students enrolled yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;