import CardImage from '../../../../../public/game.jpeg';
import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EventList() {
    return (
        <div>
            <Header />

            <div className="px-10 py-3">
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
                            <p className="text-muted-foreground">Find workshops, conferences, and meetups near you.</p>
                        </div>

                        <div className="flex gap-2">
                            <Input placeholder="Search events..." className="w-64" />
                            <Button variant="outline">Filter</Button>
                        </div>
                    </div>
                </div>
                {/* event card */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mt-2">
                    <div className="group cursor-pointer">
                        {/* Image */}
                        <div className="relative aspect-3/2 overflow-hidden rounded-lg">
                            <img
                                src={CardImage}
                                alt="Hero mindset"
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />

                            <Badge className="absolute top-3 right-3 bg-gray-600">Conference</Badge>

                            
                        </div>

                        {/* Content */}
                        <div >
                            <span className="line-clamp-1 text-base font-semibold">Learning Rust with Doc</span>
                            <span className="text-xs text-muted-foreground">
                                From 10,000 MMK / guest
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
