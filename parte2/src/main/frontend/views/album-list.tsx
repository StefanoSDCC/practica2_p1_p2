import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {Button,ComboBox,Dialog,Grid,GridColumn,GridItemModel,TextField,VerticalLayout}
from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { AlbumService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { DatePicker } from '@vaadin/react-components';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import Album from 'Frontend/generated/org/unl/music/base/models/Album';
import { useEffect, useState } from 'react';
import { BandaService } from 'Frontend/generated/endpoints';

export const config: ViewConfig = {
  title: 'Albums',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Album',
  },
};

type BandaInfo = {
  id: string;
  nombre: string;
};

type AlbumEntryFormProps = {
  onAlbumCreated?: () => void;
};

function AlbumEntryForm(props: AlbumEntryFormProps) {
  const nombre = useSignal('');
  const fecha = useSignal('');
  const bandaId = useSignal<number | null>(null); // 🔄 CAMBIO: Banda

  const dialogOpened = useSignal(false);
  const [bandas, setBandas] = useState<BandaInfo[]>([]); // 🔄 CAMBIO: Banda

  useEffect(() => {
    // 🔄 CAMBIO: Banda - cargar bandas al abrir formulario
    const cargarBandas = async () => {
      const lista = await BandaService.listBanda();
      setBandas(
        (lista ?? [])
          .filter((item): item is Record<string, string | undefined> => !!item && typeof item === 'object')
          .map(item => ({
            id: String(item.id ?? ''),
            nombre: String(item.nombre ?? ''),
          }))
      );
    };
    cargarBandas();
  }, []);

  const createAlbum = async () => {
    try {
      if (
        nombre.value.trim().length > 0 &&
        fecha.value.trim().length > 0 &&
        bandaId.value !== null // 🔄 CAMBIO: Banda
      ) {
        await AlbumService.createAlbum(
          nombre.value,
          fecha.value,
          bandaId.value // 🔄 CAMBIO: Banda
        );
        props.onAlbumCreated?.();
        nombre.value = '';
        fecha.value = '';
        bandaId.value = null; // 🔄 CAMBIO: Banda
        dialogOpened.value = false;
        Notification.show('Album creado', {
          duration: 5000,
          position: 'bottom-end',
          theme: 'success',
        });
      } else {
        Notification.show('Faltan datos para crear el álbum', {
          duration: 5000,
          position: 'top-center',
          theme: 'error',
        });
      }
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo Album"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>
              Cancelar
            </Button>
            <Button onClick={createAlbum} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem' }}>
          <TextField
            label="Nombre del Album"
            placeholder="Ingrese el nombre del Album"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />

          <DatePicker
            label="Fecha de creacion"
            placeholder="Seleccione una fecha"
            aria-label="Seleccione una fecha"
            value={fecha.value}
            onValueChanged={(evt) => (fecha.value = evt.detail.value)}
          />

          {/* 🔄 CAMBIO: Banda - ComboBox para elegir banda */}
          <ComboBox
            label="Banda"
            items={bandas}
            itemLabelPath="nombre"
            itemValuePath="id"
            value={bandaId.value !== null ? String(bandaId.value) : ''}
            onValueChanged={(evt) =>
              (bandaId.value = Number(evt.detail.value))
            }
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

export default function AlbumView() {
  const dataProvider = useDataProvider<Album>({
    list: async () => {
      const result = await AlbumService.listAll();
      return (result ?? []).filter((item): item is Album => !!item);
    },
  });

  const [bandasMap, setBandasMap] = useState<Map<number, string>>(new Map());
  useEffect(() => {
    const cargarBandas = async () => {
      const lista = await BandaService.listBanda();
      const map = new Map<number, string>();
      if (lista) {
        for (const item of lista) {
          if (item !== undefined) {
            map.set(Number(item.id), item.nombre ?? '');
          }
        }
      }
      setBandasMap(map);
    };

    cargarBandas();
  }, []);

  const albumEditando = useSignal<Album | null>(null);

  const guardarCambios = async () => {
    const album = albumEditando.value;
    if (!album) return;

    try {
      if (
        (album.nombre ?? '').trim().length > 0 &&
        (album.fecha ?? '').trim().length > 0 &&
        album.id_banda != null // 🔄 CAMBIO: Banda
      ) {
        await AlbumService.updateAlbum(
          album.id,
          album.nombre,
          album.fecha,
          album.id_banda // 🔄 CAMBIO: Banda
        );
        albumEditando.value = null;
        dataProvider.refresh();
        Notification.show('Album actualizado', {
          duration: 5000,
          position: 'bottom-end',
          theme: 'success',
        });
      } else {
        Notification.show('Faltan datos para actualizar', {
          duration: 5000,
          position: 'top-center',
          theme: 'error',
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Albums">
        <Group>
          <AlbumEntryForm onAlbumCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>

      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn path="nombre" header="Nombre del album" />
        <GridColumn
          path="fecha"
          header="Fecha"
          renderer={({ item }) =>
            item.fecha ? dateFormatter.format(new Date(item.fecha)) : 'Nunca'
          }
        />
        <GridColumn
          header="Banda"
          renderer={({ item }) =>
            bandasMap.get(Number(item.id_banda)) ?? 'Desconocida'
          }
        />

        <GridColumn
          header="Acciones"
          renderer={({ item }) => (
            <Button onClick={() => (albumEditando.value = { ...item })}>
              Actualizar
            </Button>
          )}
        />
      </Grid>

      <Dialog
        headerTitle="Editar album"
        opened={!!albumEditando.value}
        onOpenedChanged={({ detail }) => {
          if (!detail.value) albumEditando.value = null;
        }}
        footer={
          <>
            <Button onClick={() => (albumEditando.value = null)}>
              Cancelar
            </Button>
            <Button onClick={guardarCambios} theme="primary">
              Guardar
            </Button>
          </>
        }
      >
        {albumEditando.value && (
          <VerticalLayout style={{ alignItems: 'stretch', width: '18rem' }}>
            <TextField
              label="Nombre del album"
              value={albumEditando.value.nombre}
              onValueChanged={(evt) =>
                (albumEditando.value!.nombre = evt.detail.value)
              }
            />

            <DatePicker
              label="Fecha de creacion"
              value={albumEditando.value.fecha}
              onValueChanged={(evt) =>
                (albumEditando.value!.fecha = evt.detail.value)
              }
            />

            {/* 🔄 CAMBIO: Banda - ComboBox para editar banda */}
            <ComboBox
              label="Banda"
              items={Array.from(bandasMap.entries()).map(([id, nombre]) => ({
                id,
                nombre,
              }))}
              itemLabelPath="nombre"
              itemValuePath="id"
              value={albumEditando.value.id_banda !== undefined ? String(albumEditando.value.id_banda) : ''}
              onValueChanged={(e) => {
                albumEditando.value!.id_banda = Number(e.detail.value);
              }}
            />
          </VerticalLayout>
        )}
      </Dialog>
    </main>
  );
}