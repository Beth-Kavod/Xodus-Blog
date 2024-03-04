import Nav from "@/components/Nav";
import CreateAccountForm from "@/components/CreateAccountForm";    
import "@/assets/css/output.css"

export default function CreateAccountPage () {
    return (
        <div className="h-screen">
            <Nav />
            <CreateAccountForm />
        </div>
    );
}