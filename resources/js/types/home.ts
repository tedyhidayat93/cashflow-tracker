import { User } from ".";

export interface WorkspaceAppItem {
    app_prefix: string;
    is_active: boolean;
}

export interface WorkspaceItem {
    id: number;
    name: string;
    slug: string;
    apps: WorkspaceAppItem[];
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    workspaces: WorkspaceItem[];
}