package com.webiz.component.ui.wizards;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.Status;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.operation.IRunnableWithProgress;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.Wizard;
import org.eclipse.ui.INewWizard;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.IWorkbenchWizard;

/**
 * This is a sample new wizard. Its role is to create a new file 
 * resource in the provided container. If the container resource
 * (a folder or a project) is selected in the workspace 
 * when the wizard is opened, it will accept it as the target
 * container. The wizard creates one file with the extension
 * "mpe". If a sample multi-page editor (also available
 * as a template) is registered for the same extension, it will
 * be able to open it.
 */

public class CreateComponentWizard extends Wizard implements INewWizard {
	private CreateComponentWizardPage page;
	private ISelection selection;
	private static final String SITE_ID = "";
	private static final String COPOENNT_SKIN_PATH = "";
	private static final String COPONENT_PACKAGE_NAME = "";
	private static final String PROJECT_NAME = "";
	private static final String COMPONENT_TPYE_NAME = "";
	private static final String COMONENT_TITLE_NAME = "";

	/**
	 * Constructor for CreateComponentWizard.
	 */
	public CreateComponentWizard() {
		super();
		setNeedsProgressMonitor(true);
	}
	
	/**
	 * Adding the page to the wizard.
	 */

	public void addPages() {
		page = new CreateComponentWizardPage(selection);
		addPage(page);
	}

	/**
	 * This method is called when 'Finish' button is pressed in
	 * the wizard. We will create an operation and run it
	 * using wizard as execution context.
	 */
	public boolean performFinish() {
		
		final Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put(SITE_ID, page.getSiteID());
		paramMap.put(PROJECT_NAME, page.getProject());
		paramMap.put(COPOENNT_SKIN_PATH, page.getSkin());
		paramMap.put(COPONENT_PACKAGE_NAME, page.getPakcage());
		paramMap.put(COMPONENT_TPYE_NAME, page.getComonentType());
		paramMap.put(COMONENT_TITLE_NAME, page.getTitle());
		
		IRunnableWithProgress op = new IRunnableWithProgress() {
			public void run(IProgressMonitor monitor) throws InvocationTargetException {
				try {
					doFinish(paramMap, monitor);
				} catch (CoreException e) {
					throw new InvocationTargetException(e);
				} finally {
					monitor.done();
				}
			}
		};
		try {
			getContainer().run(true, false, op);
		} catch (InterruptedException e) {
			return false;
		} catch (InvocationTargetException e) {
			Throwable realException = e.getTargetException();
			MessageDialog.openError(getShell(), "Error", realException.getMessage());
			return false;
		}
		return true;
	}
	
	/**
	 * The worker method. It will find the container, create the
	 * file if missing or just replace its contents, and open
	 * the editor on the newly created file.
	 */

	private void doFinish(Map<String, Object> paramMap, IProgressMonitor monitor) throws CoreException {
		// create a sample file
		String projectName = (String)paramMap.get(PROJECT_NAME);
		
		monitor.beginTask("Creating " +projectName, 2) ;
		
		IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();
		
		IResource resource = root.findMember(new Path(projectName));
		if (!resource.exists() || !(resource instanceof IContainer)) {
			throwCoreException("project \"" + projectName + "\" does not exist.");
		}
		System.out.println(this.getClass().getResource("").getPath());
		
		String projectRootPath = root.getLocationURI().toString() + File.separator + projectName;
		
		//FileUtils.copy(new File(projectRootPath+File.separator+projectRootPath), new File(""));
		
		//common인 경우
			//module인 경우
		
			//widget인 경우
		//cloud인 경우
			//module인 경우
			
			//widget인 경우
		  
		monitor.worked(1);
		
		/*monitor.setTaskName("Opening file for editing...");
		getShell().getDisplay().asyncExec(new Runnable() {
			public void run() {
				IWorkbenchPage page =
					PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage();
				try {
					IDE.openEditor(page, file, true);
				} catch (PartInitException e) {
				}
			}
		});*/
	}
	
	
	
	
	/**
	 * We will initialize file contents with a sample text.
	 */

	private InputStream openContentStream() {
		String contents =
			"This is the initial file contents for *.mpe file that should be word-sorted in the Preview page of the multi-page editor";
		return new ByteArrayInputStream(contents.getBytes());
	}

	private void throwCoreException(String message) throws CoreException {
		IStatus status =
			new Status(IStatus.ERROR, "com.webiz.compoent.ui", IStatus.OK, message, null);
		throw new CoreException(status);
	}

	/**
	 * We will accept the selection in the workbench to see if
	 * we can initialize from it.
	 * @see IWorkbenchWizard#init(IWorkbench, IStructuredSelection)
	 */
	public void init(IWorkbench workbench, IStructuredSelection selection) {
		this.selection = selection;
	}
}