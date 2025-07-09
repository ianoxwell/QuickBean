import { SimpleGrid, Text, InputLabel, Image } from '@mantine/core';
import { IVenue } from '@models/venue.dto';

const SettingsView = ({ venue }: { venue: IVenue }) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
      <div>
        <InputLabel>Logo</InputLabel>
        {venue.logoImage && <Image src={venue.logoImage} alt={venue.name} radius="md" mb="md" w={200} />}
        {/* To display image size here, the IVenue DTO needs to include the image size. */}
      </div>
      <div>
        <InputLabel>Public Phone</InputLabel>
        <Text>{venue.publicPhone}</Text>
      </div>
      <div>
        <InputLabel>Name</InputLabel>
        <Text>{venue.name}</Text>
      </div>
      <div>
        <InputLabel>Website URL</InputLabel>
        <Text>{venue.websiteUrl}</Text>
      </div>
      <div>
        <InputLabel>Address</InputLabel>
        <Text>{venue.address}</Text>
      </div>
      <div>
        <InputLabel>City</InputLabel>
        <Text>{venue.city}</Text>
      </div>
      <div>
        <InputLabel>State</InputLabel>
        <Text>{venue.state}</Text>
      </div>
      <div>
        <InputLabel>Postcode</InputLabel>
        <Text>{venue.postcode}</Text>
      </div>
      <div>
        <InputLabel>Legal Business Name</InputLabel>
        <Text>{venue.legalBusinessName}</Text>
      </div>
      <div>
        <InputLabel>Legal Business Number</InputLabel>
        <Text>{venue.legalBusinessNumber}</Text>
      </div>
      <div>
        <InputLabel>Timezone</InputLabel>
        <Text>{venue.timezone}</Text>
      </div>
      <div>
        <InputLabel>Privacy Policy</InputLabel>
        <Text>{venue.privacyPolicy}</Text>
      </div>
    </SimpleGrid>
  );
};

export default SettingsView;
