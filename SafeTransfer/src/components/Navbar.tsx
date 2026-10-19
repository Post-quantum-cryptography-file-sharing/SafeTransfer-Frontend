import {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Upload, LogOut, Menu, FileText, Users, ChevronDown} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {useAuth} from '@/contexts/AuthContext';
import {useLogout} from '@/hooks/mutations/useLogout';
import {useSharedBatches} from '@/hooks/queries/useSharedBatches';
import {Badge} from '@/components/ui/badge';
import {StyledAvatar} from "@/components/StyledAvatar.tsx";
import {useUploadDialog} from "@/contexts/UploadDialogContext.tsx";

export function Navbar() {
    const [open, setOpen] = useState(false);
    const {user} = useAuth();
    const {data: sharedBatches} = useSharedBatches();
    const {open: openUploadDialog} = useUploadDialog();
    const sharedCount = sharedBatches?.length ?? 0;
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useLogout();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout.mutate();
    };

    const closeSheet = () => setOpen(false);

    return (
        <nav className="border-b border-border bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link to="/files" className="flex items-center gap-2">
                            <img
                                src="/safetransfer-logo.svg"
                                alt="SafeTransfer"
                                className="h-8 w-auto"
                            />
                            <span className="font-semibold text-lg">SafeTransfer</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            <Button
                                variant={isActive('/files') ? 'secondary' : 'ghost'}
                                onClick={() => navigate('/files')}
                            >
                                My Files
                            </Button>
                            <Button
                                variant={isActive('/shared') ? 'secondary' : 'ghost'}
                                onClick={() => navigate('/shared')}
                            >
                                <span>Shared with me</span>
                                {sharedCount > 0 && <Badge variant="default">{sharedCount}</Badge>}
                            </Button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Button onClick={() => openUploadDialog()}>
                            <Upload className="size-4"/>
                            Upload
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="rounded-full hover:opacity-80 transition-opacity cursor-pointer flex flex-row items-center gap-2 border border-input px-3 py-1">
                                <StyledAvatar name={user?.displayName} size="sm"/>
                                <p className="font-medium text-sm">{user?.displayName}</p>
                                <ChevronDown className="text-muted-foreground size-5"/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-72">
                                <div className="flex items-center gap-2 p-2">
                                    <StyledAvatar name={user?.displayName}/>
                                    <div className="flex flex-col truncate">
                                        <p className="text-sm font-medium truncate">{user?.displayName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                    <LogOut className="size-4"/>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex md:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                                <Menu className="size-5"/>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72 flex flex-col">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <StyledAvatar name={user?.displayName}/>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium truncate">
                                                {user?.displayName}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col gap-2 flex-1">
                                    <Button
                                        variant={isActive('/files') ? 'secondary' : 'ghost'}
                                        className="justify-start"
                                        onClick={() => {
                                            navigate('/files');
                                            closeSheet();
                                        }}
                                    >
                                        <FileText className="size-4"/>
                                        My Files
                                    </Button>

                                    <Button
                                        variant={isActive('/shared') ? 'secondary' : 'ghost'}
                                        className="justify-start"
                                        onClick={() => {
                                            navigate('/shared');
                                            closeSheet();
                                        }}
                                    >
                                        <Users className="size-4"/>
                                        Shared with me
                                        {sharedCount > 0 && (
                                            <Badge variant="default" className="ml-auto">
                                                {sharedCount}
                                            </Badge>
                                        )}
                                    </Button>

                                    <Button
                                        variant={isActive('/upload') ? 'secondary' : 'ghost'}
                                        className="justify-start"
                                        onClick={() => {
                                            openUploadDialog();
                                            closeSheet();
                                        }}
                                    >
                                        <Upload className="size-4"/>
                                        Upload
                                    </Button>
                                </div>

                                <div className="mt-auto py-4">
                                    <Separator className="mb-2"/>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-destructive hover:text-destructive"
                                        onClick={() => {
                                            handleLogout();
                                            closeSheet();
                                        }}
                                    >
                                        <LogOut className="size-4"/>
                                        Log out
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
