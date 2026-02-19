import { Star, MessageSquareText, CircleUser, MapIcon, Wallet } from 'lucide-react';
import Image1 from '../../../../../public/images/img1.jpg';
import Image2 from '../../../../../public/images/img2.jpg';
import Image3 from '../../../../../public/images/img3.jpg';
import Image4 from '../../../../../public/images/img4.jpg';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function EventDetailPage() {
    return (
        <div>
            <Header />
            <div className="px-10 py-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="col-span-2 grid grid-cols-2 gap-1.5">
                        <img src={Image1} alt="Hero mindset" className="h-full w-full rounded-md object-cover" />
                        <img src={Image2} alt="Hero mindset" className="h-full w-full rounded-md object-cover" />
                        <img src={Image3} alt="Hero mindset" className="h-full w-full rounded-md object-cover" />
                        <img src={Image4} alt="Hero mindset" className="h-full w-full rounded-md object-cover" />
                    </div>

                    <div className="flex justify-center">
                        <div className="text-cente space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold">Must-Try: Hidden Yangon Bike and Food Tour</h1>
                                <p className="text-muted-foreground mt-8">
                                    Discover local culture by bike - hidden gems, street food, lunch or dinner, and real neighborhood charm.
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <span className="flex items-center justify-center gap-1">
                                    <Star className="h-4 w-4 stroke-amber-400" /> 4.96
                                </span>
                                <span>.</span>
                                <span className="flex items-center justify-center gap-1">
                                    <MessageSquareText className="h-4 w-4" />
                                    100 reviews
                                </span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-start gap-4">
                                <CircleUser className="h-10 w-10" />

                                <div className="flex flex-col items-start">
                                    <span className="text-lg font-semibold">Hosted by Aung Pyae</span>
                                    <span className="text-base font-light text-gray-500">we live, we code, we eat</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-start gap-4">
                                <MapIcon className="h-10 w-10" />

                                <div className="flex flex-col items-start">
                                    <span className="text-lg font-semibold">Must Try Yangon Tour</span>
                                    <span className="text-base font-light text-gray-500">San Chung, Yangon</span>
                                </div>
                            </div>
                            

                            <Card className="mt-6 text-left">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">Event Details</CardTitle>
                                        <span className="font-semibold">20,000 MMK / <span className="text-base font-light text-gray-500">guest</span></span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Start Date */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Start Date</span>
                                        <span className="font-semibold">March 10, 2026 • 9:00 AM</span>
                                    </div>

                                    {/* Capacity */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Available Spots</span>
                                        <span className="font-semibold">5 / 20 left</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div className="h-2 w-[75%] rounded-full bg-primary" />
                                    </div>

                                    <Button className="w-full" size="lg">
                                        Join Event
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="gird-cols-1 mt-4 grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col justify-between">
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Meet Your Host</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-start gap-6 md:flex-row">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                        <CircleUser className="h-12 w-12" />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold">Aung Pyae</h3>

                                        <p className="text-muted-foreground">
                                            I’ve been hosting cultural bike tours in Yangon for over 5 years. My mission is to connect travelers with
                                            authentic food and hidden neighborhoods.
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>⭐ 4.9 rating</span>
                                            <span>•</span>
                                            <span>120 events hosted</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Button className="w-full" size="lg">
                                Message Host
                            </Button>
                        </div>
                        <span className="text-center text-sm text-muted-foreground">
                            To help you get the most out of this event, we recommend bringing a reusable water bottle and comfortable walking shoes.
                        </span>
                    </div>

                    <div className="col-span-2">
                        <Card className={cn('gap-3')}>
                            <CardHeader>
                                <CardTitle>Where we'll meet</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground"> Must-Try: Hidden Yangon Bike and Food Tour</p>
                                <p className="font-semibold text-muted-foreground">San Chaung Township, Yangon</p>
                            </CardContent>
                            <CardContent className="space-y-4">
                                <div className="overflow-hidden rounded-md">
                                    <iframe src="https://www.google.com/maps?q=Yangon&output=embed" className="h-[350px] w-full" loading="lazy" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
