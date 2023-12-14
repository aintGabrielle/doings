import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JoinedProjectsRecord, ProjectsRecord } from "@/lib/xata";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRightIcon, PlusSquareIcon } from "lucide-react";

import JoinedProjectCard from "@/components/joined-project-card";
import ProjectCard from "@/components/project-card";
import ProtectedPage from "@/components/protected-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import $$supabase from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";

const ProjectsPage = () => {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isJoiningProject, setIsJoiningProject] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sp = await $$supabase.auth.getUser();
    const parsed = Object.fromEntries(formData.entries());

    toast.promise(
      fetch("/api/projects/createProject", {
        method: "POST",
        body: JSON.stringify({
          ...parsed,
          owner_id: sp.data.user?.id,
        }),
      }),
      {
        success: () => {
          setIsCreatingProject(false);
          queryClient.invalidateQueries({
            queryKey: ["projects", "self", "all"],
          });
          return "Project Created!";
        },
        loading: "Creating Project...",
        error: "Something went wrong!",
      }
    );
  };

  const handleJoinProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sp = await $$supabase.auth.getUser();
    const parsed = Object.fromEntries(formData.entries());

    toast.promise(
      fetch("/api/projects/joinProject", {
        method: "POST",
        body: JSON.stringify({
          ...parsed,
          user_id: sp.data.user?.id,
        }),
      }),
      {
        success: () => {
          setIsJoiningProject(false);
          queryClient.invalidateQueries({
            queryKey: ["projects", "joined", "all"],
          });
          return "Project Joined!";
        },
        loading: "Joining Project...",
        error: "Something went wrong!",
      }
    );
  };

  const _projects = useQuery({
    queryKey: ["projects", "self", "all"],
    queryFn: async () => {
      const sp = await $$supabase.auth.getUser();

      const res = await fetch("/api/projects/getAllProjects", {
        method: "POST",
        body: JSON.stringify({
          owner_id: sp.data.user?.id,
        }),
      });
      const data = await res.json();

      return data as ProjectsRecord[];
    },
    refetchInterval: 5000,
  });

  const _joinedProjects = useQuery({
    queryKey: ["projects", "joined", "all"],
    queryFn: async () => {
      const sp = await $$supabase.auth.getUser();

      const res = await fetch("/api/projects/getAllJoinedProjects", {
        method: "POST",
        body: JSON.stringify({
          user_id: sp.data.user?.id,
        }),
      });
      const data = await res.json();

      return data as JoinedProjectsRecord[];
    },
    refetchInterval: 5000,
  });

  return (
    <ProtectedPage>
      <div className="flex flex-col gap-5 pt-10 pb-32">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1>Projects</h1>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              className="space-x-2"
              onClick={() => setIsJoiningProject(true)}
            >
              <ArrowRightIcon size={16} />
              <span>Join Project</span>
            </Button>
            <Button
              className="space-x-2"
              onClick={() => setIsCreatingProject(true)}
            >
              <PlusSquareIcon size={16} />
              <span>Create Project</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          <div className="col-span-full">
            <h4>My Projects</h4>
          </div>
          {_projects.isLoading &&
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={`myprojects_loader${i}`} className="h-[150px]" />
              ))}
          {_projects.isFetched &&
            _projects.isSuccess &&
            _projects.data?.map((p) => (
              <ProjectCard
                key={`myprojects_${p.id}`}
                queryKey={["projects", "self", "all"]}
                project={p}
              />
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          <div className="col-span-full">
            <h4>Joined Projects</h4>
          </div>
          {_joinedProjects.isLoading &&
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={`myprojects_loader${i}`} className="h-[150px]" />
              ))}
          {_joinedProjects.isFetched &&
            _joinedProjects.isSuccess &&
            _joinedProjects.data?.map((p) => (
              <JoinedProjectCard
                queryKey={["projects", "joined", "all"]}
                joined_project={p}
                key={`joinedprojects_${p.id}`}
              />
            ))}
        </div>
      </div>

      <>
        <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new Project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label>
                <span>Project Name</span>
                <Input
                  required
                  type="text"
                  name="name"
                  placeholder="Project Bright Idea "
                />
              </label>
              <label>
                <span>Short Description</span>
                <Textarea
                  required
                  rows={4}
                  name="description"
                  placeholder="A short description about the project that will be displayed on the project card"
                />
              </label>

              <Button type="submit" className="mt-5">
                Create Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isJoiningProject} onOpenChange={setIsJoiningProject}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join in a Project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleJoinProject} className="flex flex-col gap-3">
              <label>
                <span>Enrollment Code</span>
                <Input
                  required
                  type="text"
                  name="name"
                  placeholder="XXXX-XXXX "
                />
              </label>

              <Button type="submit" className="mt-5">
                Join Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    </ProtectedPage>
  );
};

export default ProjectsPage;
