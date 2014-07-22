package com.webiz.component.ui.wizards;

import java.io.File;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.Path;
import org.eclipse.jdt.internal.ui.dialogs.PackageSelectionDialog;
import org.eclipse.jdt.internal.ui.search.JavaSearchScopeFactory;
import org.eclipse.jface.dialogs.IDialogPage;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.WizardPage;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.ModifyEvent;
import org.eclipse.swt.events.ModifyListener;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Combo;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.DirectoryDialog;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Text;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.dialogs.ContainerSelectionDialog;
import org.eclipse.ui.dialogs.ProjectLocationSelectionDialog;
import org.eclipse.ui.dialogs.ResourceSelectionDialog;


/**
 * The "New" wizard page allows setting the container for the new file as well
 * as the file name. The page will only accept file name without the extension
 * OR with the extension that matches the expected one (mpe).
 */

public class CreateComponentWizardPage extends WizardPage {
	private Text projectText;
	
	private Text packageText;
	
	private Text sourceText;;
	
	private Text descText;;
	
	private Text titleText;
	
	private Combo componentType;

	private ISelection selection;
	
	private Button commonButton;
	
	private Button cloudButton;
	
	private Text cloudText;
	

	/**
	 * Constructor for SampleNewWizardPage.
	 * 
	 * @param pageName
	 */
	public CreateComponentWizardPage(ISelection selection) {
		super("wizardPage");
		setTitle("Webtree Component Project");
		setDescription("This wizard creates a new file with *.mpe extension that can be opened by a multi-page editor.");
		this.selection = selection;
	}

	/**
	 * @see IDialogPage#createControl(Composite)
	 */
	public void createControl(Composite parent) {
		Composite container = new Composite(parent, SWT.NULL);
		GridLayout layout = new GridLayout();
		container.setLayout(layout);
		layout.numColumns = 3;
		layout.verticalSpacing = 9;
		
		Label label = new Label(container, SWT.NULL);
		label.setText("&Project:");
		projectText = new Text(container, SWT.BORDER | SWT.SINGLE);
		GridData gd = new GridData(GridData.FILL_HORIZONTAL);
		projectText.setLayoutData(gd);
		projectText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});
		
		Button button = new Button(container, SWT.PUSH);
		button.setText("Browse...");
		button.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(SelectionEvent e) {
				handleBrowse();
			}
		});
		
		
		label = new Label(container, SWT.NULL);
		label.setText("&Type");
		
		commonButton = new Button(container, SWT.RADIO);
	    commonButton.setText("Common (Common Basic Component)");
	    commonButton.setSelection(true);
	    new Label(container, SWT.NULL);
	    new Label(container, SWT.NULL);
	    cloudButton = new Button(container, SWT.RADIO);
	    cloudButton.setText("Cloud : Project Site-spectific User Defined Cloud Name : "); 
	    cloudText = new Text(container, SWT.BORDER | SWT.SINGLE);
	    
		label = new Label(container, SWT.NULL);
		label.setText("&Category");
		
		componentType = new Combo(container, SWT.DROP_DOWN);
		componentType.setVisibleItemCount(2);
		componentType.add("Module");
		componentType.add("Widget");
		/*Point size = new Point(200, 50);
		componentType.setSize(size);*/
		
		componentType.addSelectionListener(new SelectionListener() {
			 
			@Override
			public void widgetSelected(SelectionEvent e) {
				
				updatepackage();
			}
			
			@Override
			public void widgetDefaultSelected(SelectionEvent e) {
			}
		});
		new Label(container, SWT.NULL);
		
		label = new Label(container, SWT.NULL);
		label.setText("&Title:");

		titleText = new Text(container, SWT.BORDER | SWT.SINGLE);
		label = new Label(container, SWT.NULL);
		
		gd = new GridData(GridData.FILL_HORIZONTAL);
		titleText.setLayoutData(gd);
		titleText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				updatepackage();
				dialogChanged();
			}
		});
		
		label = new Label(container, SWT.NULL);
		label.setText("&Package:");
		packageText = new Text(container, SWT.BORDER | SWT.SINGLE);
		gd = new GridData(GridData.FILL_HORIZONTAL);
		packageText.setLayoutData(gd);
		packageText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});

		label = new Label(container, SWT.NULL);
		
		label = new Label(container, SWT.NULL);
		label.setText("&Source Path:");
		sourceText = new Text(container, SWT.BORDER | SWT.SINGLE);
		gd = new GridData(GridData.FILL_HORIZONTAL);
		sourceText.setLayoutData(gd);
		sourceText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});

		button = new Button(container, SWT.PUSH);
		button.setText("Browse...");
		button.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(SelectionEvent e) {
				directoryhandleBrowse();
			}
		});

		label = new Label(container, SWT.NULL);
		label.setText("&Desc:");
		descText = new Text(container, SWT.BORDER | SWT.MULTI | SWT.V_SCROLL);
		gd = new GridData(GridData.FILL_BOTH);
		descText.setLayoutData(gd);
		descText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});
		
		

		/*ISelectionService service = getsh().getWorkbenchWindow().getSelectionService();
		IStructuredSelection structured = (IStructuredSelection) service.getSelection("org.eclipse.jdt.ui.PackageExplorer");
		IFile file = (IFile) structured.getFirstElement();
		IPath path = file.getLocation();
		System.out.println(path.toPortableString());*/
		
		initialize();
		dialogChanged();
		setControl(container);
		
	}

	/**
	 * Tests if the current workbench selection is a suitable container to use.
	 */

	private void initialize() {
		if (selection != null && selection.isEmpty() == false
				&& selection instanceof IStructuredSelection) {
			IStructuredSelection ssel = (IStructuredSelection) selection;
			if (ssel.size() > 1)
				return;
			Object obj = ssel.getFirstElement();
			if (obj instanceof IResource) {
				IContainer container;
				if (obj instanceof IContainer)
					container = (IContainer) obj;
				else
					container = ((IResource) obj).getParent();
				packageText.setText(container.getFullPath().toString());
			}
		}
	}

	/**
	 * Uses the standard container selection dialog to choose the new value for
	 * the container field.
	 */

	private void handleBrowse() {
		ContainerSelectionDialog dialog = new ContainerSelectionDialog(
				getShell(), ResourcesPlugin.getWorkspace().getRoot(), false,
				"Source Folder Selection");
		if (dialog.open() == ContainerSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				projectText.setText(((Path) result[0]).toString());
			}
		}
	}
	
	private void directoryhandleBrowse() {
		DirectoryDialog dialog = new DirectoryDialog(getShell());
		dialog.setMessage("Choose a save directory");
		String saveTarget = dialog.open();
		if(saveTarget != null)
		{
		   File directory = new File(saveTarget);
		}
	}
	
	private void projecthandleBrowse() {
		ProjectLocationSelectionDialog dialog = new ProjectLocationSelectionDialog(
				getShell(), ResourcesPlugin.getWorkspace().getRoot().getProject());
		if (dialog.open() == ProjectLocationSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				sourceText.setText(((Path) result[0]).toString());
			}
		}
	}
	
	private void resourcehandleBrowse() {
		ResourceSelectionDialog dialog = new ResourceSelectionDialog(
				getShell(), ResourcesPlugin.getWorkspace().getRoot(), 
				"Resource Selection");
		if (dialog.open() == ResourceSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				sourceText.setText(((Path) result[0]).toString());
			}
		}
	}
	
	private void packageHandleBrowse() {
		PackageSelectionDialog dialog = new PackageSelectionDialog(getShell()
				, PlatformUI.getWorkbench().getProgressService(), PackageSelectionDialog.F_REMOVE_DUPLICATES
				, JavaSearchScopeFactory.getInstance().createWorkspaceScope(true));
		
		if (dialog.open() == ContainerSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				packageText.setText(((Path) result[0]).toString());
			}
		}
	}
	
	private void updatepackage(){

		String packagePath="com.namo.pt.component."+componentType.getText()+"."+titleText.getText();;
		if(cloudButton.getSelection()){
			packagePath = "com.namo.pt.cloud."+cloudText.getText()+".component."+componentType.getText()+"."+titleText.getText();
		}
		
		packageText.setText(packagePath);
	}
	
	/**
	 * Ensures that both text fields are set.
	 */

	private void dialogChanged() {
		IResource container = ResourcesPlugin.getWorkspace().getRoot()
				.findMember(new Path(getContainerName()));
		String fileName = getFileName();

		if (getContainerName().length() == 0) {
			//updateStatus("source Path must be specified");
			return;
		}
		if (container == null
				|| (container.getType() & (IResource.PROJECT | IResource.FOLDER)) == 0) {
			//updateStatus("File container must exist");
			return;
		}
		if (!container.isAccessible()) {
			//updateStatus("Project must be writable");
			return;
		}
		if (fileName.length() == 0) {
			//updateStatus("File name must be specified");
			return;
		}
		if (fileName.replace('\\', '/').indexOf('/', 1) > 0) {
			//updateStatus("File name must be valid");
			return;
		}
		int dotLoc = fileName.lastIndexOf('.');
		if (dotLoc != -1) {
			String ext = fileName.substring(dotLoc + 1);
			if (ext.equalsIgnoreCase("mpe") == false) {
				//updateStatus("File extension must be \"mpe\"");
				return;
			}
		}
		updateStatus(null);
	}

	private void updateStatus(String message) {
		setErrorMessage(message);
		setPageComplete(message == null);
	}

	public String getContainerName() {
		return sourceText.getText();
	}

	public String getFileName() {
		return titleText.getText();
	}
	
}