function mySettings(prop)
{
  return(
  <Page>
      <Section
        title={<Text bold align="center">Background Color</Text>}>
  <ColorSelect
          settingsKey="myColor"
          colors={[
            {color: 'slategray'},
            {color: 'black'},
            {color: 'grey'},
            {color: 'steelblue'},
          ]}
        />
      </Section>
  </Page>
);
}
registerSettingsPage(mySettings);