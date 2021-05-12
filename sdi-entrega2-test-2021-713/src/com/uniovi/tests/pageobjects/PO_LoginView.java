package com.uniovi.tests.pageobjects;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_LoginView extends PO_NavView {

    /**
     * Método que rellena el formulario de inicio de sesión
     * 
     * @param driver    apuntando al navegador abierto actualmente
     * @param emailp    email a escribir
     * @param passwordp contraseña a escribir
     */
    static public void fillForm(WebDriver driver, String emailp,
            String passwordp) {
        WebElement email = driver.findElement(By.name("email"));
        email.click();
        email.clear();
        email.sendKeys(emailp);
        WebElement password = driver.findElement(By.name("password"));
        password.click();
        password.clear();
        password.sendKeys(passwordp);
        // Pulsar el boton de Alta.
        driver.findElement(By.id("boton-login")).click();
    }

    /**
     * Dirige al formulario de inicio de sesión
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param email  email del usuario
     * @param pass   contraseña del usuario
     */
    static public void login(WebDriver driver, String email, String pass) {
        // Vamos al formulario de logueo.
        PO_NavView.clickOption(driver, "identificarse", "id",
                "identificacion-titulo");
        // Rellenamos el formulario
        PO_LoginView.fillForm(driver, email, pass);
    }

    /**
     * Inicia sesión con el administrador y comprueba que se carga la vista
     * correspondiente
     * 
     * @param driver apuntando al navegador abierto actualmente
     */
    public static void loginAdmin(WebDriver driver) {
        // inicio correcto
        PO_LoginView.login(driver, "admin@email.com", "admin");
        // esperamos a que cargue la página
        PO_View.checkElement(driver, "id", "table");
    }

    /**
     * Inicia sesión con el usuario 5 y pulsa la opción del menu desplegable
     * indicada
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param menu   opción del menu desplegable
     */
    public static void loginUserMenu(WebDriver driver, String usuario,
            String menu) {
        // inicio correcto
        PO_LoginView.login(driver, usuario, "12345678");
        // pulsamos el botón que nos lleva al formulario
        PO_NavView.clickMenuOption(driver, menu);
    }

    /**
     * Inicio de sesión fallido: muestra su correspondiente mensaje de error
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param user   usuario
     */
    public static void loginIncorrecto(WebDriver driver, String user) {
        // inicio incorrecto
        PO_LoginView.login(driver, user, "12345678");
        // aparece la alerta de error
        assertNotNull(PO_View.checkElement(driver, "id", "alertas"));
        // muestra el mensaje de error adecuado
        assertNotNull(PO_View.checkElement(driver, "text",
                "Email o password incorrecto"));

    }

    /**
     * Inicia sesión con el usuario test5 y realiza una búsqueda
     * 
     * @param driver   apuntando al navegador abierto actualmente
     * @param busqueda busqueda a realizar
     */
    public static void loginUser5Busqueda(WebDriver driver, String busqueda) {
        // inicio correcto
        PO_LoginView.login(driver, "test5@email.com", "12345678");
        // hacemos una búsqueda vacía
        PO_PrivateView.fillFormSearch(driver, busqueda);
    }

    /**
     * Inicia sesión desde la API con el usuario test6 (válido)
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param URL    URL base
     */
    public static void loginAPI(WebDriver driver, String URL, String user) {
        // navegamos a la url de partida de la API
        driver.navigate().to(URL + "/cliente.html");
        // comprobamos que cargan los elementos
        assertNotNull(PO_View.checkElement(driver, "id", "email"));
        // inicio correcto
        PO_LoginView.fillForm(driver, user, "12345678");
        // comprobamos que accedemos al listado
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "id", "tablaCuerpo", PO_View.getTimeout());
        assertTrue(elementos.size()==1);
    }

    /**
     * Inicia incorrecto desde la API y mensaje de error
     * 
     * @param driver  apuntando al navegador abierto actualmente
     * @param URL     URL base
     * @param usuario usuario a introducir
     * @param pass    contraseña a introducir
     */
    public static void loginAPIincorrecto(WebDriver driver, String URL,
            String usuario, String pass) {
        driver.navigate().to(URL + "/cliente.html");
        // carga la pagina de login
        assertNotNull(PO_LoginView.checkElement(driver, "id", "widget-login"));
        // inicio incorrecto
        PO_LoginView.fillForm(driver, usuario, pass);
        // comprobamos que muestra el mensaje de error
        assertNotNull(
                PO_View.checkElement(driver, "text", "Usuario no encontrado"));
    }

}
