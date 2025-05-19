import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextArea, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';

import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Banda from 'Frontend/generated/org/unl/music/base/models/Banda';
import { BandaService, ExpresionService } from 'Frontend/generated/endpoints';
import Expresion from 'Frontend/generated/org/unl/music/base/models/Expresion';

export const config: ViewConfig = {
  title: 'Expresion',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 3,
    title: 'Expresion',
  },
};

type BandaEntryFormProps = {
  onBandaCreated?: () => void;
};

function BandaEntryForm(props: BandaEntryFormProps) {
  const dialogOpened = useSignal(false);

  const open = () => {
    dialogOpened.value = true;
  };

  const close = () => {
    dialogOpened.value = false;
  };

  const expresion = useSignal('');


  const createBanda = async () => {
      try {
        if (expresion.value.trim().length > 0) {
          await ExpresionService.create(expresion.value);
          if (props.onBandaCreated) {
            props.onBandaCreated();
          }
          expresion.value = '';
          dialogOpened.value = false;
          Notification.show('Banda creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } else {
          Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
        }
  
      } catch (error) {
        console.log(error);
        handleError(error);
      }
    };

  return (
    <>
      <Dialog
        aria-label="Registrar Banda"
        draggable
        modeless
        opened={dialogOpened.value}
        onOpenedChanged={(event) => {
          dialogOpened.value = event.detail.value;
        }}
        header={
          <h2
            className="draggable"
            style={{
              flex: 1,
              cursor: 'move',
              margin: 0,
              fontSize: '1.5em',
              fontWeight: 'bold',
              padding: 'var(--lumo-space-m) 0',
            }}
          >
            Registrar Banda
          </h2>
        }
        footerRenderer={() => (
          <>
            <Button onClick={close}>Cancelar</Button>
            <Button theme="primary" onClick={createBanda}>
              Registrar
            </Button>
          </>
        )}
      >
        <VerticalLayout
          theme="spacing"
          style={{ width: '300px', maxWidth: '100%', alignItems: 'stretch' }}
        >
          <VerticalLayout style={{ alignItems: 'stretch' }}>
            <TextField label="Nombre"
              placeholder='Ingrese el nombre de la banda'
              aria-label='Ingrese el nombre de la banda'
              value={expresion.value}
              onValueChanged={(evt) => (expresion.value = evt.detail.value)}
            />
            
          </VerticalLayout>
        </VerticalLayout>
      </Dialog>
      <Button onClick={open}>Registrar</Button>
    </>
  );
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

function link({ item }: { item: Banda }) {
  return (
    <span>
      <Button>
        Editar
      </Button>
    </span>
  );
}

function view_valid({ item }: { item: Expresion }) {
  return (
    <span>
      {item.isCorrecto ? "Verdadero" : "Falso"}
    </span>
  );
}

function index({ model }: { model: GridItemModel<Expresion> }) {
  return (
    <span>
      {model.index + 1}
    </span>
  );
}

export default function BandaListView() {
  const dataProvider = useDataProvider<Expresion>({
    list: async () => (await ExpresionService.listAll() ?? []).filter((e): e is Expresion => e !== undefined),
  });

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Bandas">
        <Group>
          <BandaEntryForm onBandaCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn header="Nro" renderer={index} />
        <GridColumn path="expresion" header="Expresion">
          
        </GridColumn>
        <GridColumn renderer={view_valid} header="Validada" />
        
        <GridColumn header="Acciones" renderer={link} />
      </Grid>
    </main>
  );
}
