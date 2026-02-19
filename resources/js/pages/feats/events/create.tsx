import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/host/events';
import { Form } from '@inertiajs/react';
import { AlignLeft, CalendarDays, ImageIcon, MapPin, Type, Users } from 'lucide-react';
import HostLayout from '../host/host-layout';

export default function CreateEvent() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />
            <HostLayout>
                <div className="p-4">
                    <Card className="shadow-sm dark:border-gray-800">
                        <CardContent className="pt-6">
                            <Form {...store.form()} encType="multipart/form-data" className="space-y-6">
                                {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                                    <>
                                        {/* Title */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="title" className="flex items-center gap-1.5 text-sm font-medium">
                                                <Type className="h-4 w-4 text-gray-500" />
                                                Title
                                            </Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                type="text"
                                                placeholder="e.g. Annual Tech Conference 2025"
                                                maxLength={255}
                                                className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                            />
                                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="description" className="flex items-center gap-1.5 text-sm font-medium">
                                                <AlignLeft className="h-4 w-4 text-gray-500" />
                                                Description
                                            </Label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={4}
                                                placeholder="Describe your event..."
                                                className={[
                                                    'flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background',
                                                    'placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                                    'resize-none disabled:cursor-not-allowed disabled:opacity-50',
                                                    errors.description ? 'border-red-500 focus-visible:ring-red-500' : 'border-input',
                                                ].join(' ')}
                                            />
                                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                                        </div>

                                        {/* Start Date & End Date */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="start_date" className="flex items-center gap-1.5 text-sm font-medium">
                                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                                    Start Date
                                                </Label>
                                                <Input
                                                    id="start_date"
                                                    name="start_date"
                                                    type="datetime-local"
                                                    className={errors.start_date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                                />
                                                {errors.start_date && <p className="mt-1 text-xs text-red-500">{errors.start_date}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="end_date" className="flex items-center gap-1.5 text-sm font-medium">
                                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                                    End Date
                                                </Label>
                                                <Input
                                                    id="end_date"
                                                    name="end_date"
                                                    type="datetime-local"
                                                    className={errors.end_date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                                />
                                                {errors.end_date && <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>}
                                            </div>
                                        </div>

                                        {/* Location & Capacity */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="location" className="flex items-center gap-1.5 text-sm font-medium">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                    Location
                                                </Label>
                                                <Input
                                                    id="location"
                                                    name="location"
                                                    type="text"
                                                    placeholder="e.g. Yangon, Myanmar"
                                                    maxLength={255}
                                                    className={errors.location ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                                />
                                                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="capacity" className="flex items-center gap-1.5 text-sm font-medium">
                                                    <Users className="h-4 w-4 text-gray-500" />
                                                    Capacity
                                                </Label>
                                                <Input
                                                    id="capacity"
                                                    name="capacity"
                                                    type="number"
                                                    min={1}
                                                    placeholder="e.g. 200"
                                                    className={errors.capacity ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                                />
                                                {errors.capacity && <p className="mt-1 text-xs text-red-500">{errors.capacity}</p>}
                                            </div>
                                        </div>

                                        {/* Image Upload */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="image" className="flex items-center gap-1.5 text-sm font-medium">
                                                <ImageIcon className="h-4 w-4 text-gray-500" />
                                                Cover Image
                                            </Label>
                                            <div
                                                className={[
                                                    'flex w-full items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors',
                                                    'cursor-pointer hover:border-primary/60',
                                                    errors.image ? 'border-red-500' : 'border-input',
                                                ].join(' ')}
                                            >
                                                <label htmlFor="image" className="flex w-full cursor-pointer flex-col items-center gap-2">
                                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                                    <span className="text-center text-sm text-gray-500 dark:text-gray-400">
                                                        Click to upload or drag & drop
                                                    </span>
                                                    <span className="text-xs text-gray-400">JPEG, PNG, JPG, GIF — max 2 MB</span>
                                                    <Input
                                                        id="image"
                                                        name="image"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-3 pt-2">
                                            <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={processing}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Creating…' : 'Create Event'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </HostLayout>
        </div>
    );
}
