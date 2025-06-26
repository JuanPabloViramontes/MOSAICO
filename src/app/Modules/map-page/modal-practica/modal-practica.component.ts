import { Component, EventEmitter, Input, Output, ElementRef, ViewChild  } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-modal-practica',
  standalone: false,
  templateUrl: './modal-practica.component.html',
  styleUrls: ['./modal-practica.component.css'],
})
export class ModalPracticaComponent {
  @Input() show = false;
  @Input() practica: any;
  @Output() closeModal = new EventEmitter<void>();
  @Input() filteredData: any[] = [];
  @ViewChild('pdfContent', { static: false }) pdfContentRef!: ElementRef;

  close() {
    this.closeModal.emit();
  }
async getBase64FromAsset(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async descargarPDF() {
    try {
      // Obtener imágenes en base64
      const logoMosaico = await this.getBase64FromAsset('assets/images/Mosaico-logo-sinFondo.png');
      const logoXenia = await this.getBase64FromAsset('assets/images/xenia.png');

      // 1. Configuración inicial del documento
      const contenido = document.createElement('div');
      contenido.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
      contenido.style.color = '#333';
      contenido.style.padding = '20px';
      contenido.style.maxWidth = '100%';

      // 2. Encabezado con logos en la derecha
      const headerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h1 style="color: #2c3e50; font-size: 22px; margin: 0; font-weight: 500;">${this.practica.buena_practica}</h1>
            <p style="color: #7f8c8d; font-size: 16px; margin: 5px 0 0 0;">${this.practica.estado}</p>
          </div>
          <div style="display: flex; gap: 20px; align-items: center;">
            <img src="${logoMosaico}" style="height: 110px; width: auto; object-fit: contain;" />
            <img src="${logoXenia}" style="height: 60px; width: auto; object-fit: contain;" />
          </div>
        </div>
        <div style="border-bottom: 2px solid #2c3e50; margin-bottom: 25px;"></div>
      `;

      contenido.innerHTML = headerHTML;

      // 3. Sección de detalles principales
      const detallesHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div>
            <h2 style="color: #2c3e50; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">
              Detalles principales
            </h2>
            <p><strong style="color: #3498db; display: inline-block; width: 120px;">Categoría:</strong> ${this.practica.categoria}</p>
            <p><strong style="color: #3498db; display: inline-block; width: 120px;">Subcategoría:</strong> ${this.practica.subcategoria}</p>
            <p><strong style="color: #3498db; display: inline-block; width: 120px;">Naturaleza:</strong> ${this.practica.naturaleza_politica_publica}</p>
            ${this.practica.tema_covid ? `<p><strong style="color: #3498db; display: inline-block; width: 120px;">Tema COVID:</strong> ${this.practica.tema_covid}</p>` : ''}
          </div>

          <div>
            <h2 style="color: #2c3e50; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">
              Resumen
            </h2>
            <p style="line-height: 1.6;">${this.practica.resumen}</p>
          </div>
        </div>
      `;
      contenido.innerHTML += detallesHTML;

      // 4. Sección de población objetivo
      const poblacionHTML = `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c3e50; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">
            Población objetivo
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px;">
            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px;">
              <strong style="color: #3498db;">Retornados:</strong><br>
              ${this.practica.poblacion_objetivo?.retornados || 'No aplica'}
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px;">
              <strong style="color: #3498db;">Tránsito:</strong><br>
              ${this.practica.poblacion_objetivo?.transito || 'No aplica'}
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px;">
              <strong style="color: #3498db;">Mexicanos en el extranjero:</strong><br>
              ${this.practica.poblacion_objetivo?.mexicanos_extranjero || 'No aplica'}
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px;">
              <strong style="color: #3498db;">Refugiados/asilados:</strong><br>
              ${this.practica.poblacion_objetivo?.refugiados_asilados || 'No aplica'}
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px;">
              <strong style="color: #3498db;">Migración de destino:</strong><br>
              ${this.practica.poblacion_objetivo?.migracion_destino || 'No aplica'}
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 4px;">
              <strong style="color: #3498db;">Migración interna:</strong><br>
              ${this.practica.poblacion_objetivo?.migracion_interna || 'No aplica'}
            </div>
          </div>
        </div>
      `;
      contenido.innerHTML += poblacionHTML;

      // 5. Sección de criterios
      const criteriosHTML = `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c3e50; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">
            Criterios de buena práctica
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
            <div><strong>Innovación:</strong> ${this.practica.criterios_buenas_practicas?.innovacion || 'No especificado'}</div>
            <div><strong>Eficacia:</strong> ${this.practica.criterios_buenas_practicas?.eficacia || 'No especificado'}</div>
          </div>
        </div>
      `;
      contenido.innerHTML += criteriosHTML;

      // 6. Matriz de buenas prácticas
      contenido.innerHTML += `
        <h2 style="color: #2c3e50; font-size: 20px; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; margin: 40px 0 20px 0;">
          Matriz de Buenas Prácticas Relacionadas
        </h2>
        <p style="font-size: 14px; color: #7f8c8d; margin-bottom: 20px;">
          Mostrando ${this.filteredData.length} prácticas filtradas - ${new Date().toLocaleDateString()}
        </p>
      `;

      // 7. Crear tabla de matriz
      const tablaMatriz = document.createElement('table');
      tablaMatriz.style.width = '100%';
      tablaMatriz.style.borderCollapse = 'separate';
      tablaMatriz.style.borderSpacing = '0';
      tablaMatriz.style.fontSize = '12px';
      tablaMatriz.style.marginBottom = '30px';

      // Encabezados de tabla
      const thead = document.createElement('thead');
      thead.style.backgroundColor = '#2c3e50';
      thead.style.color = 'white';
      
      const headerRow = document.createElement('tr');
      ['Estado', 'Naturaleza', 'Buena Práctica', 'Resumen', 'Categoría', 'Subcategoría'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.padding = '12px 8px';
        th.style.textAlign = 'left';
        th.style.borderBottom = '2px solid #ddd';
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      tablaMatriz.appendChild(thead);

      // Filas de datos
      const tbody = document.createElement('tbody');
      this.filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
        
        const crearCelda = (texto: string, ancho?: string) => {
          const td = document.createElement('td');
          td.textContent = texto || '';
          td.style.padding = '10px 8px';
          td.style.borderBottom = '1px solid #eee';
          td.style.verticalAlign = 'top';
          if (ancho) td.style.width = ancho;
          return td;
        };

        row.appendChild(crearCelda(item.estado, '10%'));
        row.appendChild(crearCelda(item.naturaleza_politica_publica, '15%'));
        row.appendChild(crearCelda(item.buena_practica, '20%'));
        
        const resumenCelda = crearCelda('', '25%');
        resumenCelda.innerHTML = item.resumen ? `
          <div style="max-height: 100px; overflow: hidden; text-overflow: ellipsis;">
            ${item.resumen}
          </div>
        ` : '';
        row.appendChild(resumenCelda);
        
        row.appendChild(crearCelda(item.categoria, '15%'));
        row.appendChild(crearCelda(item.subcategoria, '15%'));
        
        tbody.appendChild(row);
      });
      tablaMatriz.appendChild(tbody);
      contenido.appendChild(tablaMatriz);

      // 8. Configuración de PDF
      const options = {
        filename: `Reporte - ${this.practica.buena_practica}.pdf`,
        margin: [20, 20, 20, 20],
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 1,
          width: 1200,
          logging: true,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1200,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'landscape',
          hotfixes: ['px_scaling'],
          compress: false
        }
      };

      // Esperar a que las imágenes se carguen
      await new Promise<void>((resolve) => {
        const checkImages = () => {
          const images = contenido.getElementsByTagName('img');
          let loaded = 0;
          
          for (let i = 0; i < images.length; i++) {
            if (images[i].complete) loaded++;
          }

          if (loaded === images.length) {
            resolve();
          } else {
            setTimeout(checkImages, 100);
          }
        };
        checkImages();
      });

      // Generar PDF
      await html2pdf().set(options).from(contenido).save();
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el documento. Por favor intente nuevamente.');
    }
  }
}