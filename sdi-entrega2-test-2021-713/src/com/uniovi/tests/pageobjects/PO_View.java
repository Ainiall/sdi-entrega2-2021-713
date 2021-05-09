package com.uniovi.tests.pageobjects;

import java.util.List;

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
        PO_View.checkElement(driver, "id", "alertas");
        // muestra el mensaje de error adecuado
        PO_View.checkElement(driver, "text", mensaje);

    }
}

