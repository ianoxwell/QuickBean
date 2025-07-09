import { IVenue } from '@models/venue.dto';
import { apiSlice } from './apiSlice';

export const venueApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    updateVenue: builder.mutation<IVenue, Partial<IVenue>>({
      query: (body) => ({
        url: `/venue/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Venue', id: arg.id }]
    }),
    uploadVenueImage: builder.mutation<{ url: string }, { venueId: number, file: File }>({
      query: ({ venueId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/venue/upload-image/${venueId}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  })
});

export const {
  useUpdateVenueMutation,
  useUploadVenueImageMutation,
} = venueApiSlice;
