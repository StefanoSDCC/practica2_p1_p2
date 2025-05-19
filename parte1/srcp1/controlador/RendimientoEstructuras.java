package controlador;

import java.io.BufferedReader; 
import java.io.FileReader; 
import java.io.IOException;
import java.util.HashSet; 
import java.util.Set; 
 
public class RendimientoEstructuras { 
   
   static class Node<E> { 
       E data; 
       Node<E> next; 
       
       Node(E data) { 
           this.data = data;
       } 
       
       Node(E data, Node<E> next) { 
           this.data = data; 
           this.next = next; 
       } 
   } 
   
   static class LinkedList<E> { 
       private Node<E> head; 
       private Node<E> last; 
       private int length; 
       
       LinkedList() { 
         
       } 
       
       boolean isEmpty() { 
           return head == null;
       } 
       
       private Node<E> getNode(int pos) { 
           if (isEmpty() || pos < 0 || pos >= length) { 
               return null; 
           }
           
           Node<E> current = head; 
           for (int i = 0; i < pos; i++) { 
               current = current.next; 
           } 
           return current; 
       } 
       
       E get(int pos) { 
           Node<E> node = getNode(pos); 
           return node != null ? node.data : null; 
       } 
       
       void add(E data) { 
           Node<E> newNode = new Node<>(data); 
           
           if (isEmpty()) { 
               head = last = newNode; 
           } else { 
               last.next = newNode; 
               last = newNode; 
           }
           length++; 
       } 
       
       int size() { 
           return length; 
       }

       
       @SuppressWarnings("unchecked")
       E[] toArray(E[] a) {
           if (a.length < length) {
               
               a = (E[]) java.lang.reflect.Array.newInstance(
                       a.getClass().getComponentType(), length);
           }
           
           int i = 0;
           for (Node<E> x = head; x != null; x = x.next) {
               a[i++] = x.data;
           }
           
           if (a.length > length) {
               a[length] = null; 
           }
           
           return a;
       }
   } 
   
   public static void main(String[] args) { 
       long inicioPrograma = System.currentTimeMillis(); 
       
       String archivo = "data.txt"; 
       
       LinkedList<Integer> datosOriginales = cargarDatos(archivo); 
       
       if (datosOriginales.size() == 0) { 
           System.out.println("Datos del archivo no cargados."); 
           return; 
       } 
       
       int totalElementos = datosOriginales.size(); 
       System.out.println("Datos cargados: " + totalElementos + " elementos"); 
       
       
       long inicioArreglo = System.currentTimeMillis(); 
       Integer[] arreglo = new Integer[totalElementos];
       arreglo = datosOriginales.toArray(arreglo);
       long finArreglo = System.currentTimeMillis(); 
       
       
       long inicioLista = System.currentTimeMillis();
       LinkedList<Integer> lista = new LinkedList<>(); 
       for (int i = 0; i < datosOriginales.size(); i++) {
           lista.add(datosOriginales.get(i)); 
       } 
       long finLista = System.currentTimeMillis(); 
       
       
       datosOriginales = null; 
       System.gc(); 
       
       
       long inicioDuplicadosArreglo = System.currentTimeMillis(); 
       Set<Integer> duplicadosArreglo = new HashSet<>(); 
       Set<Integer> elementosVistos = new HashSet<>(); 
       
       for (Integer num : arreglo) { 
           if (!elementosVistos.add(num)) { 
               duplicadosArreglo.add(num); 
           } 
       } 
       long finDuplicadosArreglo = System.currentTimeMillis();
       
       elementosVistos = null; 
       System.gc(); 
       
       
       long inicioDuplicadosLista = System.currentTimeMillis(); 
       Set<Integer> duplicadosLista = new HashSet<>(); 
       Set<Integer> elementosVistosLista = new HashSet<>(); 
       
       for (int i = 0; i < lista.size(); i++) { 
           Integer elemento = lista.get(i); 
           if (!elementosVistosLista.add(elemento)) { 
               duplicadosLista.add(elemento); 
           } 
       } 
       long finDuplicadosLista = System.currentTimeMillis(); 
       
       elementosVistosLista = null; 
       System.gc(); 
       
       
       System.out.println("\n--- RESULTADOS DE RENDIMIENTO ---"); 
       System.out.println("Tiempo de llenado (milisegundos):"); 
       System.out.println("- Arreglo: " + (finArreglo - inicioArreglo)); 
       System.out.println("- Lista Enlazada: " + (finLista - inicioLista));
       
       System.out.println("\nTiempo de búsqueda de duplicados (milisegundos):"); 
       System.out.println("- Arreglo: " + (finDuplicadosArreglo - inicioDuplicadosArreglo)); 
       System.out.println("- Lista Enlazada: " + (finDuplicadosLista - inicioDuplicadosLista));
       
       System.out.println("\n--- ELEMENTOS DUPLICADOS ---"); 
       System.out.println("Duplicados encontrados en el Arreglo (" + duplicadosArreglo.size() + " elementos):"); 

       for (Integer num : duplicadosArreglo) { 
           System.out.print(num + " "); 
       } 
       
       System.out.println("\n\nDuplicados encontrados en la Lista Enlazada (" + duplicadosLista.size() + " elementos):"); 
       for (Integer num : duplicadosLista) { 
           System.out.print(num + " "); 
       } 
       System.out.println(); 
       
       long finPrograma = System.currentTimeMillis(); 
       System.out.println("\nTiempo total de ejecución del programa: " + (finPrograma - inicioPrograma) + " milisegundos"); 
   } 
   
   private static LinkedList<Integer> cargarDatos(String archivo) {
       LinkedList<Integer> datos = new LinkedList<>(); 
       
       try (BufferedReader br = new BufferedReader(new FileReader(archivo))) { 
           String linea; 
           while ((linea = br.readLine()) != null) {          
               String[] valores = linea.trim().split("\\s+"); 
               for (String valor : valores) { 
                   try { 
                       datos.add(Integer.parseInt(valor)); 
                   } catch (NumberFormatException e) { 
                       
                   } 
               } 
           } 
       } catch (IOException e) { 
           System.out.println("Error al leer el archivo: " + e.getMessage()); 
       } 
       
       return datos; 
   } 
}