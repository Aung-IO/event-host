import { update } from '@/actions/App/Http/Controllers/EventController';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import HostLayout from '../host/host-layout';

export default function EditEvent({ event }: { event: any }) {
    const { data, setData, processing, errors, submit } = useForm({
        title: event.title ?? '',
        description: event.description ?? '',
        start_date: event.start_date ? event.start_date.slice(0, 16) : '',
        end_date: event.end_date ? event.end_date.slice(0, 16) : '',
        location: event.location ?? '',
        capacity: event.capacity ?? '',
        image: null as File | null,
        _method: 'PUT',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submit(update(event.id));
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />
            <HostLayout>
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Event</CardTitle>
                            <CardDescription>Update the details of your event.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Event title"
                                        className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        placeholder="Describe your event"
                                        className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="SanChung, Yangon"
                                        className={errors.location ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                                </div>

                                {/* Dates */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <Input
                                            id="start_date"
                                            type="datetime-local"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className={errors.start_date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input
                                            id="end_date"
                                            type="datetime-local"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className={errors.end_date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                                    </div>
                                </div>

                                {/* Capacity */}
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min={1}
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        className={errors.capacity ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="image">Cover Image</Label>
                                    {/* Show current image preview */}
                                    {event.image && (
                                        <div className="mb-2">
                                            <p className="mb-1 text-xs text-muted-foreground">Current image:</p>
                                            <img src={`/storage/${event.image}`} alt="Current cover" className="h-24 w-40 rounded-md object-cover" />
                                        </div>
                                    )}
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setData('image', e.target.files[0]);
                                            }
                                        }}
                                        className={errors.image ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    <p className="text-xs text-muted-foreground">Leave empty to keep the current image.</p>
                                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving…' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </HostLayout>
        </div>
    );
}
