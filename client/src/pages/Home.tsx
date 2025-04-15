import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';

const Home: React.FC = () => {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-surface-dark border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold">
            <span className="text-primary">Video</span>
            <span className="text-white">Reel</span>
          </h1>
          <Link href="/editor">
            <Button className="bg-primary hover:bg-primary/90">
              <i className="ri-add-line mr-2"></i>
              New Project
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-6">
        <section className="mb-12">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h2 className="text-3xl font-bold mb-4">Create stunning videos in minutes</h2>
            <p className="text-lg text-gray-400">
              Edit videos, add creative captions, and use professional templates to make your content stand out.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-surface-dark border-gray-800">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <i className="ri-scissors-cut-line text-2xl text-primary"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy Video Editing</h3>
                <p className="text-gray-400">
                  Trim, cut, and combine clips with our intuitive timeline editor.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-surface-dark border-gray-800">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                  <i className="ri-font-size text-2xl text-secondary"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Creative Captions</h3>
                <p className="text-gray-400">
                  Add eye-catching captions with customizable fonts, animations, and styles.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-surface-dark border-gray-800">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <i className="ri-magic-line text-2xl text-accent"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Professional Templates</h3>
                <p className="text-gray-400">
                  Choose from dozens of templates to quickly create stunning videos.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Link href="/editor">
              <Button variant="outline" className="bg-gray-800 hover:bg-gray-700">
                <i className="ri-add-line mr-2"></i>
                New Project
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-opacity-50 rounded-full border-t-transparent"></div>
            </div>
          ) : !projects || projects.length === 0 ? (
            <Card className="bg-surface-dark border-gray-800 mb-8">
              <CardContent className="py-12 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <i className="ri-video-line text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  Create your first video project to get started with VideoReel editor.
                </p>
                <Link href="/editor">
                  <Button className="bg-primary hover:bg-primary/90">
                    Create New Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href={`/editor?project=${project.id}`}>
                  <Card className="bg-surface-dark border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors">
                    <div className="aspect-video bg-gray-900 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <i className="ri-play-circle-line text-4xl text-gray-500"></i>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{project.title}</h3>
                      <p className="text-xs text-gray-400">
                        Last edited: {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <footer className="bg-surface-dark border-t border-gray-800 py-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© 2023 VideoReel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
