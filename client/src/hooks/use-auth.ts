import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, websiteBuilderApi } from '@/lib/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { GuestProjectData } from '@/components/editor/editor-context';

const GUEST_STORAGE_KEY = 'hostsblue_guest_project';

async function migrateGuestProject(): Promise<string | null> {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return null;
    const guest: GuestProjectData = JSON.parse(raw);
    if (!guest.name || !guest.pages?.length) return null;

    // Create project on server
    const project = await websiteBuilderApi.createProject({
      name: guest.name,
      businessType: guest.businessType,
      businessDescription: '',
    });

    // Save theme
    await websiteBuilderApi.updateProject(project.uuid, { theme: guest.theme });

    // Save each page's blocks
    for (const page of guest.pages) {
      if (page.isHomePage) {
        // Home page already exists, just update it
        await websiteBuilderApi.savePage(project.uuid, page.slug, {
          title: page.title,
          blocks: page.blocks,
          showInNav: page.showInNav,
        });
      } else {
        // Create additional pages
        try {
          await websiteBuilderApi.createPage(project.uuid, {
            title: page.title,
            slug: page.slug,
            blocks: page.blocks,
            showInNav: page.showInNav,
          });
        } catch {
          // Page might already exist, try updating
          await websiteBuilderApi.savePage(project.uuid, page.slug, {
            title: page.title,
            blocks: page.blocks,
            showInNav: page.showInNav,
          });
        }
      }
    }

    // Clear guest data
    localStorage.removeItem(GUEST_STORAGE_KEY);
    return project.uuid;
  } catch (err) {
    console.error('Guest project migration failed:', err);
    return null;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    retry: false,
    staleTime: Infinity,
  });

  const handlePostAuth = async () => {
    const restore = searchParams.get('restore');
    const redirect = searchParams.get('redirect');

    if (restore === 'guest' && localStorage.getItem(GUEST_STORAGE_KEY)) {
      const uuid = await migrateGuestProject();
      if (uuid) {
        navigate(`/dashboard/website-builder/${uuid}/edit`, { replace: true });
        return;
      }
    }

    if (redirect && redirect.startsWith('/')) {
      navigate(redirect, { replace: true });
    } else {
      navigate('/dashboard');
    }
  };

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.customer);
      handlePostAuth();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: { email: string; password: string; firstName: string; lastName: string }) => authApi.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.customer);
      handlePostAuth();
    },
  });

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    queryClient.clear();
    navigate('/');
  };

  return {
    customer: customer || null,
    isAuthenticated: !!customer,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
