package com.uniovi.tests.pageobjects;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_View {
    protected static int timeout = 2;

    public static int getTimeout() {
        return timeout;
    }

    public static void setTimeout(int timeout) {
        PO_View.timeout = timeout;
    }

    /**
     * Espera por la visibilidad de un elemento/s en la vista actualmente
     * cargandose en driver..
     * 
     * @param driver: apuntando al navegador abierto actualmente.
     * @param type:   tipo de elemento
     * @param text:   nombre asignado al tipo
     * @return Se retornará la lista de elementos resultantes de la búsqueda.
     */
    static public List<WebElement> checkElement(WebDriver driver, String type,
            String text) {
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                type, text, getTimeout());
        return elementos;
    }

    /**
     * 
     * @param driver  apuntando al navegador abierto actualmente
     * @param mensaje mensaje de alerta a mostrar
     */
    public static void alerta(WebDriver driver, String mensaje) {
        // aparece la alerta de error
        assertNotNull(PO_View.checkElement(driver, "id", "alertas"));
        // muestra el mensaje de error adecuado
        assertNotNull(PO_View.checkElement(driver, "text", mensaje));

    }

    public static void comprobacionNotificaciones(WebDriver driver, String URL, int i) {
        PO_LoginView.loginAPI(driver, URL, "test7@email.com");
        // comprobamos que existe el menú de chats y lo pulsamos
        assertNotNull(PO_View.checkElement(driver, "id", "barra-menu-chats"));
        driver.findElement(By.id("barra-menu-chats")).click();
        // comprobamos que carga el chat
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "text",
                "precio justo", PO_View.getTimeout());
        assertTrue(elementos.size() == 1);

        // vemos que el ultimo chat tiene una notificación
        elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
                "/html/body/div/div/table/tbody/tr[last()]/td[4]",
                PO_View.getTimeout());
        assertTrue(elementos.size() == 1);
        int num = Integer.parseInt(driver
                .findElement(By.xpath(
                        "/html/body/div/div/table/tbody/tr[last()]/td[4]"))
                .getText());
        assertTrue(num == i);
    }
}

