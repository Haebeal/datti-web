import { ProfileForm } from "@/components/ProfileForm";
import {
  Card,
  CardBody,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

export const SettingPanel = () => {
  return (
    <Card>
      <CardBody>
        <Tabs>
          <TabList>
            <Tab>
              <Heading size="sm">プロフィール</Heading>
            </Tab>
            <Tab>
              <Heading size="sm">振込先口座</Heading>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ProfileForm />
            </TabPanel>
            <TabPanel>
              <div />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};
