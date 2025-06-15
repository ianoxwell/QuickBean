import { IVenue, IVenueShort } from '@models/venue.dto';
import { createSlice } from '@reduxjs/toolkit';

export interface IVenueState extends IVenueShort {
  venue?: IVenue;
}

const initialState = {
  id: 0,
  name: '',
  slug: '',
  logoImage: undefined,
  venue: undefined
} as IVenueState;

const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {
    setFullVenue: (state, { payload }: { payload: IVenue }) => {
      state.id = payload.id;
      state.name = payload.name;
      state.slug = payload.slug;
      state.logoImage = payload.logoImage;
      state.venue = payload;
    },
    setVenueShort: (state, { payload }: { payload: IVenueShort }) => {
      state.id = payload.id;
      state.name = payload.name;
      state.slug = payload.slug;
      state.logoImage = payload.logoImage;
      state.venue = undefined; // Clear the full venue details
    },
    clearVenue: () => {
      return initialState;
    }
  }
});

export const { setFullVenue, setVenueShort, clearVenue } = venueSlice.actions;
export default venueSlice.reducer;
