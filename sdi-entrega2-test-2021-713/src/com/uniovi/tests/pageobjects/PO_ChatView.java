package com.uniovi.tests.pageobjects;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_ChatView extends PO_NavView {

    /**
     * Rellena el formulario de nuevo mensaje para el chat
     * 
     * @param driver   apuntando al navegador abierto actualmente
     * @param mensajep mensaje a escribir
     */
    static public void fillForm(WebDriver driver, String mensajep) {
        WebElement mensaje = driver.findElement(By.name("agregar-mensaje"));
        mensaje.click();
        mensaje.clear();
        mensaje.sendKeys(mensajep);

        driver.findElement(By.id("boton-agregar")).click();
    }

    /**
     * Selecciona y dirige al chat de la oferta buscada
     * 
     * @param driver apuntando al navegador abierto actualmente
     */
    public static void chat(WebDriver driver, String busqueda) {
        // filtramos con una búsqueda
        PO_PrivateView.fillFormSearchAPI(driver, busqueda);
        // carga tabla
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "id", "tablaCuerpo", PO_View.getTimeout());
        assertTrue(elementos.size()==1);
        // pulsamos el primer chat
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[1]/td[5]/a"))
                .click();
    }

    /**
     * Inserta un mensaje y comprueba que carga correctamente
     * @param string
     */
    public static void insertarMensaje(WebDriver driver, String mensaje) {
        // insertamos un mensaje
        PO_ChatView.fillForm(driver, mensaje);
        // esperamos a que se muestre
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "text",
                mensaje, PO_View.getTimeout());
        assertTrue(elementos.size() == 1);
    }
}
