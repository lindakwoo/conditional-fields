import React from 'react';
import { Paragraph } from '@contentful/f36-components';
import { EditorAppSDK, FieldAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { Field as FieldComponent, FieldWrapper } from '@contentful/default-field-editors';

const getWidgetId = (fieldId: string, sdk: EditorAppSDK) => {
  return sdk?.editor?.editorInterface?.controls?.find((field) => field.fieldId === fieldId)?.widgetId || '';
}
// TODO: fix interface
interface State {
  fieldConfiguration: unknown;
  currentEntry: unknown;
}

const Field = () => {
  const [state, setState] = React.useState<State>();
  const sdk = useSDK<FieldAppSDK>();

  
  React.useEffect(() => {

    const fetchConfig = async () => {
      // TODO: maybe need locale?
      const fieldConfiguration = await sdk.cma.entry.get({ entryId: "5gUw6aQze1BkArPWjihIN2" });
      console.log('res: ', fieldConfiguration.fields.data);
      
      // TODO: the first two requests can be done in parallel
      const currentEntrySys = await sdk.entry.getSys();
      const controls = sdk.editor.editorInterface.controls;
      console.log('controls', controls)
      const currentEntry = await sdk.cma.entry.get({ entryId: currentEntrySys.id });
      setState({ fieldConfiguration: fieldConfiguration.fields.data, currentEntry });
    }
    fetchConfig();
  }, [sdk.cma.entry, sdk.entry])

  // React.useEffect(() => {
  //   if (state?.fieldConfiguration) {
  //   const shouldRenderWhen = state?.fieldConfiguration?.['en-US'][sdk.contentType.sys.id];
  //   if (shouldRenderWhen[sdk.entry.fields.appearance.getValue()].includes(sdk.field.id)) {
  //     console.log('resize the window?')
  //     // const iframeParent = window.frameElement.parentElement;
  //     console.log('iframeParent: ', window);
  //     sdk.window.updateHeight(0);
  //   }
  // }
  // })
  console.log('field',sdk.field)

  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  if (!state?.fieldConfiguration) {
    return <p>loading state...</p>;
  }

  // TODO: will need to add logic to the type field... or maybe even a separate app
  // we check if there is a configuration option for this content type in order to apply conditional rendering
  // otherwise fallback to the default field editor
  if (state?.fieldConfiguration?.['en-US'][sdk.contentType.sys.id]) {
    // then we check if there is any conditional rules that need to be applied to the field

    const shouldRenderWhen = state?.fieldConfiguration?.['en-US'][sdk.contentType.sys.id];
    console.log('shoud render when', shouldRenderWhen)

    if (shouldRenderWhen[sdk.entry.fields.appearance.getValue()].includes(sdk.field.id)) {
        
      // This does not workerData...the widgetId ends up being a long string of numbers cuz it's assigned an app in contentful
console.log('widget id', getWidgetId('gridCardsRow1', sdk) )
      
      // TODO: put correct field here
      return (
        <FieldWrapper sdk={sdk} name={sdk.field.name}>
          {/* hard code the widgetId for now... */}
          <FieldComponent sdk={sdk} widgetId = 'entryLinksEditor'/> 
        </FieldWrapper>
      );
    } else {
      // this will eventually return null 
      // fix the css so that it works!!!
      return <Paragraph className = "deleteMe" style = {{'&  .entry-editor__field-group > .deleteMe': {display:"none"}}} >nothing goes here!!!</Paragraph>
    }
  } else {
    // TODO: default field here...
    return <Paragraph>loading</Paragraph>;
  }
};

export default Field;
